import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'
import { createChart, CandlestickSeries, LineSeries, ColorType } from 'lightweight-charts'
import type { 
  IChartApi, 
  ISeriesApi, 
  CandlestickData as LWCandlestickData, 
  LineData, 
  Time, 
  UTCTimestamp,
  DeepPartial, 
  ChartOptions 
} from 'lightweight-charts'

export interface CandlestickData {
  open: number
  high: number
  low: number
  close: number
  timestamp: number
}

interface PriceChartProps {
  data: number[] | CandlestickData[]
  width?: number
  height?: number
  color?: string
  showGradient?: boolean
  chartType?: 'line' | 'candlestick'
  animateEntry?: boolean
  symbol?: string
  theme?: 'light' | 'dark'
  onCrosshairMove?: (price: number | null, time: Time | null) => void
  priceFormat?: {
    precision?: number
    minMove?: number
  }
}

export interface ChartHandle {
  fitContent: () => void
  getVisibleRange: () => { from: Time | null; to: Time | null } | null
  setVisibleRange: (range: { from: Time; to: Time }) => void
  takeScreenshot: () => string
  updateData: (newData: number[] | CandlestickData[]) => void
  enableAutoScroll: () => void
  disableAutoScroll: () => void
}

const PriceChart = forwardRef<ChartHandle, PriceChartProps>(({ 
  data, 
  width, 
  height = 400, 
  color = '#10B981',
  showGradient = true,
  chartType = 'line',
  symbol = 'CRYPTO',
  theme = 'dark',
  onCrosshairMove,
  priceFormat = { precision: 2, minMove: 0.01 }
}, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Line' | 'Candlestick'> | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const userInteractedRef = useRef<boolean>(false)
  const isInitialLoadRef = useRef<boolean>(true)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true)

  const isLineChart = chartType === 'line'
  const isCandlestickData = (item: any): item is CandlestickData => {
    return typeof item === 'object' && 
           item !== null && 
           'open' in item && 
           'high' in item && 
           'low' in item && 
           'close' in item && 
           'timestamp' in item
  }

  // Chart configuration based on theme
  const chartOptions: DeepPartial<ChartOptions> = {
    layout: {
      textColor: theme === 'dark' ? '#D1D4DC' : '#191919',
      background: {
        type: ColorType.Solid,
        color: theme === 'dark' ? '#1a1a1a' : '#ffffff'
      }
    },
    grid: {
      vertLines: {
        color: theme === 'dark' ? '#2B2B43' : '#E0E3EB',
        style: 1,
        visible: true
      },
      horzLines: {
        color: theme === 'dark' ? '#2B2B43' : '#E0E3EB',
        style: 1,
        visible: true
      }
    },
    crosshair: {
      mode: 1,
      vertLine: {
        color: theme === 'dark' ? '#758696' : '#6A6D78',
        width: 1,
        style: 3,
        visible: true,
        labelVisible: true
      },
      horzLine: {
        color: theme === 'dark' ? '#758696' : '#6A6D78',
        width: 1,
        style: 3,
        visible: true,
        labelVisible: true
      }
    },
    rightPriceScale: {
      borderColor: theme === 'dark' ? '#485c7b' : '#D1D4DC',
      visible: true,
      entireTextOnly: true
    },
    timeScale: {
      borderColor: theme === 'dark' ? '#485c7b' : '#D1D4DC',
      timeVisible: true,
      secondsVisible: false,
      rightOffset: 12,
      barSpacing: 12,
      fixLeftEdge: true,
      lockVisibleTimeRangeOnResize: true
    },
    localization: {
      priceFormatter: (price: number) => {
        if (price >= 1000000) {
          return (price / 1000000).toFixed(2) + 'M'
        } else if (price >= 1000) {
          return (price / 1000).toFixed(2) + 'K'
        }
        return price.toFixed(priceFormat.precision || 2)
      }
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: true
    },
    handleScale: {
      axisPressedMouseMove: true,
      mouseWheel: true,
      pinch: true,
      axisDoubleClickReset: true
    },
    kineticScroll: {
      mouse: true,
      touch: true
    }
  }

  // Utility function to validate numeric values
  const isValidNumber = (value: any): value is number => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value)
  }

  // Transform data to TradingView format
  const transformData = () => {
    if (!data || data.length === 0) return []

    // Check if we have valid first item to determine data type
    const firstItem = data[0]
    if (firstItem === undefined || firstItem === null) return []

    if (isLineChart) {
      if (isCandlestickData(firstItem)) {
        // Convert candlestick to line data using close prices
        return (data as CandlestickData[])
          .filter(item => item && isValidNumber(item.close) && isValidNumber(item.timestamp))
          .map((item) => ({
            time: Math.floor(item.timestamp / 1000) as UTCTimestamp,
            value: Number(item.close)
          }))
          .filter(item => isValidNumber(item.value)) as LineData[]
      } else {
        // Convert number array to line data
        return (data as number[])
          .filter(value => isValidNumber(value))
          .map((value, index) => {
            const timeValue = Math.floor((Date.now() - (data.length - index - 1) * 60000) / 1000) as UTCTimestamp
            return {
              time: timeValue,
              value: Number(value) // Ensure it's definitely a number
            }
          })
          .filter(item => isValidNumber(item.value)) as LineData[]
      }
    } else {
      // Candlestick chart
      if (isCandlestickData(firstItem)) {
        return (data as CandlestickData[])
          .filter(item => 
            item && 
            isValidNumber(item.open) && 
            isValidNumber(item.high) && 
            isValidNumber(item.low) && 
            isValidNumber(item.close) && 
            isValidNumber(item.timestamp)
          )
          .map(item => ({
            time: Math.floor(item.timestamp / 1000) as UTCTimestamp,
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.close)
          }))
          .filter(item => 
            isValidNumber(item.open) && 
            isValidNumber(item.high) && 
            isValidNumber(item.low) && 
            isValidNumber(item.close)
          ) as LWCandlestickData[]
      } else {
        // Convert number array to candlestick data
        return (data as number[])
          .filter(value => isValidNumber(value))
          .map((value, index) => {
            const numValue = Number(value)
            return {
              time: Math.floor((Date.now() - (data.length - index - 1) * 60000) / 1000) as UTCTimestamp,
              open: numValue,
              high: numValue * 1.01,
              low: numValue * 0.99,
              close: numValue
            }
          })
          .filter(item => 
            isValidNumber(item.open) && 
            isValidNumber(item.high) && 
            isValidNumber(item.low) && 
            isValidNumber(item.close)
          ) as LWCandlestickData[]
      }
    }
  }

  // Create chart effect
  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: width || chartContainerRef.current.clientWidth,
      height: height
    })

    chartRef.current = chart

    // Create series based on chart type
    let series: ISeriesApi<'Line' | 'Candlestick'>

    if (isLineChart) {
      series = chart.addSeries(LineSeries, {
        color: color,
        lineWidth: 2,
        ...(showGradient && {
          topColor: color + '40',
          bottomColor: color + '00'
        }),
        priceFormat: {
          type: 'price',
          precision: priceFormat.precision || 2,
          minMove: priceFormat.minMove || 0.01
        }
      })
    } else {
      series = chart.addSeries(CandlestickSeries, {
        upColor: theme === 'dark' ? '#00d4aa' : '#26a69a',
        downColor: theme === 'dark' ? '#fb8500' : '#ef5350',
        borderVisible: true,
        wickUpColor: theme === 'dark' ? '#00d4aa' : '#26a69a',
        wickDownColor: theme === 'dark' ? '#fb8500' : '#ef5350',
        borderUpColor: theme === 'dark' ? '#00d4aa' : '#26a69a',
        borderDownColor: theme === 'dark' ? '#fb8500' : '#ef5350',
        wickVisible: true,
        priceFormat: {
          type: 'price',
          precision: priceFormat.precision || 2,
          minMove: priceFormat.minMove || 0.01
        }
      })
    }

    seriesRef.current = series

    // Set data
    const chartData = transformData()
    if (chartData.length > 0) {
      series.setData(chartData)
      // Only fit content on initial load
      if (isInitialLoadRef.current) {
        chart.timeScale().fitContent()
        isInitialLoadRef.current = false
      }
    }

    // Event listeners
    if (onCrosshairMove) {
      chart.subscribeCrosshairMove((param) => {
        if (param.time) {
          const data = param.seriesData.get(series)
          const price = data ? (typeof data === 'number' ? data : (data as any).close || (data as any).value) : null
          onCrosshairMove(price, param.time)
        } else {
          onCrosshairMove(null, null)
        }
      })
    }

    // Track user interactions with the chart
    chart.timeScale().subscribeVisibleTimeRangeChange(() => {
      // User has interacted with the chart (scrolled, zoomed, etc.)
      if (!userInteractedRef.current) {
        userInteractedRef.current = true
        setAutoScrollEnabled(false)
      }
    })

    // Setup resize observer for responsive behavior
    if (!width) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return
        
        const { width } = entries[0].contentRect
        chart.applyOptions({ width: Math.max(width, 200) })
      })
      
      resizeObserverRef.current.observe(chartContainerRef.current)
    }

    return () => {
      chart.remove()
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [chartType, theme, color]) // Recreate chart when type, theme, or color changes

  // Reset interaction state when chart type changes
  useEffect(() => {
    userInteractedRef.current = false
    isInitialLoadRef.current = true
    setAutoScrollEnabled(true)
  }, [chartType])

  // Update data when it changes
  useEffect(() => {
    if (seriesRef.current && data && data.length > 0) {
      try {
        const chartData = transformData()
        console.log('Chart data transformed:', {
          dataLength: data.length,
          chartDataLength: chartData?.length,
          isLineChart,
          chartType,
          firstDataItem: data[0],
          firstChartItem: chartData?.[0]
        })
        
        if (chartData && chartData.length > 0) {
          // Validate that all data items have the required properties
          const isValidData = chartData.every(item => {
            if (isLineChart) {
              return item && typeof (item as LineData).value === 'number' && !isNaN((item as LineData).value)
            } else {
              const candleItem = item as LWCandlestickData
              return candleItem && 
                     typeof candleItem.open === 'number' && !isNaN(candleItem.open) &&
                     typeof candleItem.high === 'number' && !isNaN(candleItem.high) &&
                     typeof candleItem.low === 'number' && !isNaN(candleItem.low) &&
                     typeof candleItem.close === 'number' && !isNaN(candleItem.close)
            }
          })
          
          if (isValidData) {
            seriesRef.current.setData(chartData)
            // Only fit content if user hasn't interacted with the chart yet
            if (!userInteractedRef.current) {
              chartRef.current?.timeScale().fitContent()
            }
          } else {
            console.error('Invalid data detected, skipping update')
          }
        }
      } catch (error) {
        console.error('Error updating chart data:', error)
      }
    }
  }, [data, chartType])

  // Update theme and styling
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions(chartOptions)
    }
  }, [theme])

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    fitContent: () => {
      chartRef.current?.timeScale().fitContent()
      userInteractedRef.current = false // Reset interaction state
      setAutoScrollEnabled(true)
    },
    getVisibleRange: () => {
      const range = chartRef.current?.timeScale().getVisibleRange()
      return range ? { from: range.from as Time, to: range.to as Time } : null
    },
    setVisibleRange: (range: { from: Time; to: Time }) => {
      chartRef.current?.timeScale().setVisibleRange(range)
    },
    takeScreenshot: () => {
      const canvas = chartRef.current?.takeScreenshot()
      return canvas instanceof HTMLCanvasElement ? canvas.toDataURL() : ''
    },
    updateData: (newData: number[] | CandlestickData[]) => {
      if (seriesRef.current && newData.length > 0) {
        // Update data prop and let useEffect handle the transformation
        const chartData = transformData()
        if (chartData.length > 0) {
          seriesRef.current.setData(chartData)
        }
      }
    },
    enableAutoScroll: () => {
      userInteractedRef.current = false
      setAutoScrollEnabled(true)
    },
    disableAutoScroll: () => {
      userInteractedRef.current = true
      setAutoScrollEnabled(false)
    }
  }))

  return (
    <div className="relative w-full">
      {/* Chart Header */}
      <div className={`absolute top-0 left-0 z-10 p-4 pointer-events-none ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">{symbol}</h3>
          <span className={`px-2 py-1 rounded text-sm ${
            theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
            {chartType === 'line' ? 'Line Chart' : 'Candlestick Chart'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${
            theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
            {data.length} points
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className={`w-full rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
        style={{ height: `${height}px` }}
      />
      
      {/* Chart Controls */}
      <div className={`absolute bottom-2 right-2 flex space-x-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        <button
          onClick={() => {
            chartRef.current?.timeScale().fitContent()
            userInteractedRef.current = false
            setAutoScrollEnabled(true)
          }}
          className={`px-3 py-1 rounded text-sm hover:opacity-80 transition-opacity ${
            theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Fit
        </button>
        <button
          onClick={() => {
            if (autoScrollEnabled) {
              userInteractedRef.current = true
              setAutoScrollEnabled(false)
            } else {
              userInteractedRef.current = false
              setAutoScrollEnabled(true)
              chartRef.current?.timeScale().fitContent()
            }
          }}
          className={`px-3 py-1 rounded text-sm hover:opacity-80 transition-all ${
            autoScrollEnabled
              ? (theme === 'dark' ? 'bg-green-700 hover:bg-green-600 text-green-100' : 'bg-green-600 hover:bg-green-500 text-white')
              : (theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-400 hover:bg-gray-300 text-gray-700')
          }`}
          title={autoScrollEnabled ? 'Auto-scroll enabled - Click to disable' : 'Auto-scroll disabled - Click to enable'}
        >
          {autoScrollEnabled ? '📍' : '🔒'} Auto
        </button>
        <button
          onClick={() => chartRef.current?.timeScale().resetTimeScale()}
          className={`px-3 py-1 rounded text-sm hover:opacity-80 transition-opacity ${
            theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Reset
        </button>
      </div>
    </div>
  )
})

PriceChart.displayName = 'PriceChart'

export default PriceChart