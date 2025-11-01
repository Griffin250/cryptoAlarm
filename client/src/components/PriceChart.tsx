import { useEffect, useRef, forwardRef, useImperativeHandle, useState, useCallback, useMemo } from 'react'
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
  volume?: number
}

// Binance WebSocket API types
interface BinanceWebSocketKline {
  e: string  // Event type
  E: number  // Event time
  s: string  // Symbol
  k: {
    t: number  // Kline start time
    T: number  // Kline close time
    s: string  // Symbol
    i: string  // Interval
    f: number  // First trade ID
    L: number  // Last trade ID
    o: string  // Open price
    c: string  // Close price
    h: string  // High price
    l: string  // Low price
    v: string  // Base asset volume
    n: number  // Number of trades
    x: boolean // Is this kline closed?
    q: string  // Quote asset volume
    V: string  // Taker buy base asset volume
    Q: string  // Taker buy quote asset volume
    B: string  // Ignore
  }
}

// Timeframe configuration
export interface TimeframeOption {
  label: string
  value: string
  binanceInterval: string
  limit: number // Default number of candles to fetch
}

export interface DateRangeOption {
  label: string
  value: string
  days: number | null // null means "All"
}

// Constants for API endpoints
const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws'
const BINANCE_REST_URL = 'https://api.binance.com/api/v3'
const LOAD_MORE_THRESHOLD = 50 // Load more when user scrolls to within 50 candles of the start

// Timeframe options
export const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  { label: '1s', value: '1s', binanceInterval: '1s', limit: 300 },
  { label: '5s', value: '5s', binanceInterval: '1s', limit: 300 }, // Simulated with 1s
  { label: '15s', value: '15s', binanceInterval: '1s', limit: 300 }, // Simulated with 1s
  { label: '1m', value: '1m', binanceInterval: '1m', limit: 500 },
  { label: '3m', value: '3m', binanceInterval: '3m', limit: 500 },
  { label: '5m', value: '5m', binanceInterval: '5m', limit: 500 },
  { label: '15m', value: '15m', binanceInterval: '15m', limit: 500 },
  { label: '30m', value: '30m', binanceInterval: '30m', limit: 500 },
  { label: '1h', value: '1h', binanceInterval: '1h', limit: 500 },
  { label: '2h', value: '2h', binanceInterval: '2h', limit: 500 },
  { label: '4h', value: '4h', binanceInterval: '4h', limit: 500 },
  { label: '6h', value: '6h', binanceInterval: '6h', limit: 400 },
  { label: '12h', value: '12h', binanceInterval: '12h', limit: 400 },
  { label: '1d', value: '1d', binanceInterval: '1d', limit: 365 },
  { label: '3d', value: '3d', binanceInterval: '3d', limit: 300 },
  { label: '1w', value: '1w', binanceInterval: '1w', limit: 200 },
  { label: '1M', value: '1M', binanceInterval: '1M', limit: 100 }
]

// Date range presets
export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { label: 'Today', value: 'today', days: 1 },
  { label: '7D', value: '7d', days: 7 },
  { label: '30D', value: '30d', days: 30 },
  { label: '90D', value: '90d', days: 90 },
  { label: '1Y', value: '1y', days: 365 },
  { label: 'All', value: 'all', days: null }
]

// Component props
interface PriceChartProps {
  /** Initial data to display (optional if using symbol for live data) */
  data?: number[] | CandlestickData[]
  /** Trading pair symbol (e.g., 'BTCUSDT') */
  symbol: string
  /** Candlestick interval (e.g., '1m', '5m', '1h') - deprecated, use defaultTimeframe */
  interval?: string
  /** Default timeframe to show on load */
  defaultTimeframe?: string
  /** Whether to show timeframe selector UI */
  showTimeframeSelector?: boolean
  /** Whether to show date range selector UI */
  showDateRangeSelector?: boolean
  /** Callback when timeframe changes */
  onTimeframeChange?: (timeframe: string) => void
  /** Callback when date range changes */
  onDateRangeChange?: (range: string) => void
  width?: number
  height?: number
  color?: string
  showGradient?: boolean
  chartType?: 'line' | 'candlestick'
  animateEntry?: boolean
  theme?: 'light' | 'dark'
  onCrosshairMove?: (price: number | null, time: Time | null) => void
  priceFormat?: {
    precision?: number
    minMove?: number
  }
  /** Whether to show the data points counter. Useful for debugging. */
  showDataPoints?: boolean
  /** Number of candles to load when fetching historical data */
  historicalCandlesLimit?: number
  /** Callback when historical data is being loaded */
  onLoadingStateChange?: (isLoading: boolean) => void
}

// Utility function for transforming WebSocket kline data
const transformWebSocketKline = (kline: BinanceWebSocketKline['k']): CandlestickData => ({
  timestamp: kline.t,
  open: parseFloat(kline.o),
  high: parseFloat(kline.h),
  low: parseFloat(kline.l),
  close: parseFloat(kline.c),
  volume: parseFloat(kline.v)
})

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
  symbol = 'BTCUSDT',
  interval = '1m',
  defaultTimeframe = '1m',
  showTimeframeSelector = true,
  showDateRangeSelector = true,
  onTimeframeChange,
  onDateRangeChange,
  theme = 'dark',
  onCrosshairMove,
  priceFormat = { precision: 2, minMove: 0.01 },
  showDataPoints = false,
  historicalCandlesLimit,
  onLoadingStateChange
}, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Line' | 'Candlestick'> | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const userInteractedRef = useRef<boolean>(false)
  const isInitialLoadRef = useRef<boolean>(true)
  const isLoadingRef = useRef<boolean>(false)
  const oldestTimestampRef = useRef<number | null>(null)
  const timeframeDropdownRef = useRef<HTMLDivElement>(null)
  
  // Timeframe and date range state
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(defaultTimeframe || interval || '1m')
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all')
  const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isTimeframeOpen, setIsTimeframeOpen] = useState<boolean>(false)
  const [candleData, setCandleData] = useState<CandlestickData[]>(
    data?.map(d => typeof d === 'number' ? ({
      timestamp: Date.now(),
      open: d,
      high: d,
      low: d,
      close: d
    }) : d) || []
  )

    // Collapsible state for each timeframe category
    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
      Seconds: true,
      Minutes: false,
      Hours: false,
      'Days & Weeks': false
    })

    const toggleCategory = (label: string) => {
      setOpenCategories((prev) => ({ ...prev, [label]: !prev[label] }))
    }

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

  // Chart configuration based on theme (memoized to prevent unnecessary re-renders)
  const chartOptions: DeepPartial<ChartOptions> = useMemo(() => ({
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
  }), [theme, priceFormat.precision])

  // Utility function to validate numeric values
  const isValidNumber = (value: any): value is number => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value)
  }

  // Transform data to TradingView format
  const transformData = (inputData = data) => {
    if (!inputData || inputData.length === 0) return []

    // Check if we have valid first item to determine data type
    const firstItem = inputData[0]
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
            const timeValue = Math.floor((Date.now() - (inputData.length - index - 1) * 60000) / 1000) as UTCTimestamp
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
              time: Math.floor((Date.now() - (inputData.length - index - 1) * 60000) / 1000) as UTCTimestamp,
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

  // WebSocket connection setup
  const setupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    let mounted = true;
    const timeframeConfig = TIMEFRAME_OPTIONS.find(tf => tf.value === selectedTimeframe) || TIMEFRAME_OPTIONS[3]
    const ws = new WebSocket(BINANCE_WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`${symbol.toLowerCase()}@kline_${timeframeConfig.binanceInterval}`],
        id: 1
      }))
    }

    ws.onmessage = (event) => {
      if (!mounted) return;
      const message = JSON.parse(event.data)
      if (message.e === 'kline') {
        const klineData = transformWebSocketKline(message.k)
        setCandleData(prevData => {
          if (!mounted) return prevData;
          const lastCandle = prevData[prevData.length - 1]
          if (lastCandle && lastCandle.timestamp === klineData.timestamp) {
            // Update last candle if it's still open
            return [...prevData.slice(0, -1), klineData]
          } else {
            // Add new candle
            return [...prevData, klineData]
          }
        })

        if (autoScrollEnabled) {
          requestAnimationFrame(() => {
            chartRef.current?.timeScale().scrollToRealTime()
          })
        }
      }
    }

    ws.onerror = (error) => {
      if (!mounted) return;
      console.error('WebSocket error:', error)
      setError('WebSocket connection error. Retrying...')
    }

    ws.onclose = () => {
      if (!mounted) return;
      // Try to reconnect after a delay
      setTimeout(() => {
        if (wsRef.current === ws) { // Only reconnect if this is still the current ws
          setupWebSocket()
        }
      }, 5000)
    }

    return () => {
      mounted = false;
      ws.close()
    }
  }, [symbol, selectedTimeframe, autoScrollEnabled])

  // Load more historical data function
  const loadMoreData = useCallback(async () => {
    if (isLoadingRef.current || !oldestTimestampRef.current) return
    
    const timeframeConfig = TIMEFRAME_OPTIONS.find(tf => tf.value === selectedTimeframe) || TIMEFRAME_OPTIONS[3]
    
    isLoadingRef.current = true
    setIsLoading(true)
    onLoadingStateChange?.(true)

    try {
      const url = new URL(`${BINANCE_REST_URL}/klines`)
      url.searchParams.append('symbol', symbol.toUpperCase())
      url.searchParams.append('interval', timeframeConfig.binanceInterval)
      url.searchParams.append('limit', (historicalCandlesLimit || timeframeConfig.limit).toString())
      url.searchParams.append('endTime', oldestTimestampRef.current.toString())

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`Failed to fetch more historical data: ${response.statusText}`)
      }

      const klines = await response.json()
      const historicalData: CandlestickData[] = klines.map((kline: any[]) => ({
        timestamp: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5])
      }))

      if (historicalData.length > 0) {
        oldestTimestampRef.current = historicalData[0].timestamp
        setCandleData(prevData => [...historicalData, ...prevData])
      }
    } catch (error) {
      console.error('Error loading more historical data:', error)
      setError('Failed to load historical data. Please try again.')
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
      onLoadingStateChange?.(false)
    }
  }, [symbol, selectedTimeframe, historicalCandlesLimit, onLoadingStateChange])

  // Handle time scale scroll to load more historical data
  useEffect(() => {
    if (!chartRef.current) return

    const timeScale = chartRef.current.timeScale()
    
    const handleVisibleLogicalRangeChange = () => {
      const visibleRange = timeScale.getVisibleLogicalRange()
      if (visibleRange) {
        const leftEdge = visibleRange.from
        if (leftEdge < LOAD_MORE_THRESHOLD) {
          loadMoreData()
        }
      }
    }

    timeScale.subscribeVisibleLogicalRangeChange(handleVisibleLogicalRangeChange)

    return () => {
      timeScale.unsubscribeVisibleLogicalRangeChange(handleVisibleLogicalRangeChange)
    }
  }, [loadMoreData])

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
          upColor: '#0ECB81',
          downColor: '#F6465D',
          borderVisible: true,
          wickUpColor: '#0ECB81',
          wickDownColor: '#F6465D',
          borderUpColor: '#0ECB81',
          borderDownColor: '#F6465D',
          wickVisible: true,
          priceFormat: {
            type: 'price',
            precision: priceFormat.precision || 2,
            minMove: priceFormat.minMove || 0.01
          }
        })
    }

    seriesRef.current = series

    // Set initial data
    if (candleData.length > 0) {
      const chartData = transformData(candleData)
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

  // Initialize WebSocket connection and load historical data
  useEffect(() => {
    const timeframeConfig = TIMEFRAME_OPTIONS.find(tf => tf.value === selectedTimeframe) || TIMEFRAME_OPTIONS[3]
    const dateRangeConfig = DATE_RANGE_OPTIONS.find(dr => dr.value === selectedDateRange)
    
    // Calculate time range based on date selection
    let startTime: number | undefined
    let limit = historicalCandlesLimit || timeframeConfig.limit
    
    if (dateRangeConfig && dateRangeConfig.days !== null) {
      const now = Date.now()
      startTime = now - (dateRangeConfig.days * 24 * 60 * 60 * 1000)
    }
    
    // Load historical data first
    const loadInitialData = async () => {
      setIsLoading(true)
      setError(null)
      onLoadingStateChange?.(true)

      try {
        const url = new URL(`${BINANCE_REST_URL}/klines`)
        url.searchParams.append('symbol', symbol.toUpperCase())
        url.searchParams.append('interval', timeframeConfig.binanceInterval)
        url.searchParams.append('limit', limit.toString())
        if (startTime) {
          url.searchParams.append('startTime', startTime.toString())
        }

        const response = await fetch(url.toString())
        if (!response.ok) {
          throw new Error(`Failed to fetch historical data: ${response.statusText}`)
        }

        const klines = await response.json()
        const historicalData: CandlestickData[] = klines.map((kline: any[]) => ({
          timestamp: kline[0],
          open: parseFloat(kline[1]),
          high: parseFloat(kline[2]),
          low: parseFloat(kline[3]),
          close: parseFloat(kline[4]),
          volume: parseFloat(kline[5])
        }))

        if (historicalData.length > 0) {
          oldestTimestampRef.current = historicalData[0].timestamp
          setCandleData(historicalData)
        }
      } catch (error) {
        console.error('Error loading historical data:', error)
        setError('Failed to load historical data. Please try again.')
      } finally {
        setIsLoading(false)
        onLoadingStateChange?.(false)
      }
    }

    loadInitialData()

    // Then set up WebSocket for real-time data
    const cleanupWs = setupWebSocket()

    return () => {
      cleanupWs()
    }
  }, [symbol, selectedTimeframe, selectedDateRange, historicalCandlesLimit, onLoadingStateChange])

  // Reset interaction state when chart type changes
  useEffect(() => {
    userInteractedRef.current = false
    isInitialLoadRef.current = true
    setAutoScrollEnabled(true)
  }, [chartType])

  // Close timeframe dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeframeDropdownRef.current && !timeframeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeframeOpen(false)
      }
    }

    if (isTimeframeOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isTimeframeOpen])

  // Update data when it changes
  useEffect(() => {
    let disposed = false;
    if (seriesRef.current && data && data.length > 0) {
      try {
        const chartData = transformData();
        if (chartData && chartData.length > 0) {
          // Validate that all data items have the required properties
          const isValidData = chartData.every(item => {
            if (isLineChart) {
              return item && typeof (item as LineData).value === 'number' && !isNaN((item as LineData).value);
            } else {
              const candleItem = item as LWCandlestickData;
              return candleItem && 
                     typeof candleItem.open === 'number' && !isNaN(candleItem.open) &&
                     typeof candleItem.high === 'number' && !isNaN(candleItem.high) &&
                     typeof candleItem.low === 'number' && !isNaN(candleItem.low) &&
                     typeof candleItem.close === 'number' && !isNaN(candleItem.close);
            }
          });
          if (isValidData) {
            if (!disposed) {
              seriesRef.current.setData(chartData);
              // Only fit content if user hasn't interacted with the chart yet
              if (!userInteractedRef.current) {
                chartRef.current?.timeScale().fitContent();
              }
            }
          } else {
            console.error('Invalid data detected, skipping update');
          }
        }
      } catch (error) {
        console.error('Error updating chart data:', error);
      }
    }
    return () => {
      disposed = true;
    };
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

  // Timeframe category state

  // Handle timeframe change
  const handleTimeframeChange = useCallback((newTimeframe: string) => {
    setSelectedTimeframe(newTimeframe)
    setError(null)
    isInitialLoadRef.current = true
    userInteractedRef.current = false
    setAutoScrollEnabled(true)
    setIsTimeframeOpen(false) // Close dropdown after selection
    onTimeframeChange?.(newTimeframe)
  }, [onTimeframeChange])

  // Handle date range change
  const handleDateRangeChange = useCallback((newRange: string) => {
    setSelectedDateRange(newRange)
    setError(null)
    isInitialLoadRef.current = true
    onDateRangeChange?.(newRange)
  }, [onDateRangeChange])

  // Get current timeframe label
  const getCurrentTimeframeLabel = () => {
    const current = TIMEFRAME_OPTIONS.find(tf => tf.value === selectedTimeframe)
    return current?.label || '1m'
  }

  // Timeframe categories
  const timeframeCategories = [
    { label: 'Seconds', options: TIMEFRAME_OPTIONS.slice(0, 3) },
    { label: 'Minutes', options: TIMEFRAME_OPTIONS.slice(3, 8) },
    { label: 'Hours', options: TIMEFRAME_OPTIONS.slice(8, 13) },
    { label: 'Days & Weeks', options: TIMEFRAME_OPTIONS.slice(13) }
  ]

  return (
    <div className="relative w-full">
      {/* Compact Timeframe & Date Range Selectors */}
      {(showTimeframeSelector || showDateRangeSelector) && (
        <div className={`flex items-center justify-center gap-3 mb-3 p-2.5 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
        }`}>
          {/* Collapsible Timeframe Dropdown */}
          {showTimeframeSelector && (
            <div ref={timeframeDropdownRef} className="relative flex items-center gap-2">
              <label className={`text-xs font-medium whitespace-nowrap ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Timeframe:
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all focus:outline-none focus:ring-2 flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-200 border border-gray-600 focus:ring-blue-500 hover:bg-gray-600'
                      : 'bg-white text-gray-800 border border-gray-300 focus:ring-blue-400 hover:bg-gray-50'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span>{getCurrentTimeframeLabel()}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isTimeframeOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Custom Dropdown Menu */}
                  {isTimeframeOpen && (
                    <div 
                      className={`absolute top-full left-0 mt-1 rounded-lg shadow-lg border overflow-hidden z-50 min-w-[220px] ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {timeframeCategories.map((category, idx) => (
                        <div key={category.label}>
                          {/* Collapsible Category Header */}
                          <button
                            type="button"
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold focus:outline-none transition-colors ${
                              theme === 'dark' ? 'bg-gray-900 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={() => toggleCategory(category.label)}
                          >
                            <span>{category.label}</span>
                            <svg className={`w-4 h-4 ml-2 transition-transform ${openCategories[category.label] ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          {/* Options (collapsible) */}
                          {openCategories[category.label] && (
                            <div className={idx < timeframeCategories.length - 1 ? `border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}` : ''}>
                              {category.options.map((tf) => (
                                <button
                                  key={tf.value}
                                  onClick={() => handleTimeframeChange(tf.value)}
                                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                    selectedTimeframe === tf.value
                                      ? theme === 'dark'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-blue-500 text-white'
                                      : theme === 'dark'
                                        ? 'text-gray-200 hover:bg-gray-700'
                                        : 'text-gray-800 hover:bg-gray-50'
                                  }`}
                                >
                                  {tf.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Date Range Dropdown */}
          {showDateRangeSelector && (
            <div className="flex items-center gap-2">
              <label className={`text-xs font-medium whitespace-nowrap ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Range:
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                disabled={isLoading}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 border border-gray-600 focus:ring-green-500 hover:bg-gray-600'
                    : 'bg-white text-gray-800 border border-gray-300 focus:ring-green-400 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {DATE_RANGE_OPTIONS.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className={`animate-spin h-4 w-4 border-2 border-t-transparent rounded-full ${
                theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
              }`} />
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Loading...
              </span>
            </div>
          )}
        </div>
      )}

      {/* Chart Header */}
      <div className={`absolute top-0 left-0 z-10 p-4 pointer-events-none ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">{symbol}</h3>
          {showDataPoints && candleData && (
            <span className={`px-2 py-1 rounded text-sm ${
              theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'
            }`} title="Number of data points in the chart">
              {candleData.length} points
            </span>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className={`w-full rounded-lg relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
        style={{ height: `${height}px` }}
      >
        {isLoading && (
          <div 
            className={`absolute inset-0 flex items-center justify-center bg-opacity-50 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading data...
              </span>
            </div>
          </div>
        )}
        {error && !isLoading && (
          <div 
            className={`absolute inset-0 flex items-center justify-center bg-opacity-50 ${
              theme === 'dark' ? 'bg-red-900/50' : 'bg-red-50'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="text-red-500">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span className={`text-sm text-center ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                {error}
              </span>
              <button
                onClick={() => {
                  setError(null)
                  setupWebSocket()
                }}
                className={`mt-2 px-4 py-1 rounded text-sm ${
                  theme === 'dark'
                    ? 'bg-red-700 hover:bg-red-600 text-red-100'
                    : 'bg-red-500 hover:bg-red-400 text-white'
                }`}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
      
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