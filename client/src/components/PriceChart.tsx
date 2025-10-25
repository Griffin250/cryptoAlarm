import React, { useEffect, useRef } from 'react'

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
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  width = 800, 
  height = 200, 
  color = '#10B981',
  showGradient = true,
  chartType = 'line',
  animateEntry = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [visibleDataCount, setVisibleDataCount] = React.useState(animateEntry ? 1 : data.length)

  const isLineChart = chartType === 'line'
  const isCandlestickData = (item: any): item is CandlestickData => {
    return typeof item === 'object' && 'open' in item && 'high' in item && 'low' in item && 'close' in item
  }

  // Animation effect for progressive data reveal
  React.useEffect(() => {
    if (!animateEntry || data.length <= 1) {
      setVisibleDataCount(data.length)
      return
    }

    if (visibleDataCount < data.length) {
      const timer = setTimeout(() => {
        setVisibleDataCount(prev => Math.min(prev + 1, data.length))
      }, 150) // Add new candle/point every 150ms
      
      return () => clearTimeout(timer)
    }
  }, [data.length, visibleDataCount, animateEntry])

  // Reset animation when chart type changes
  React.useEffect(() => {
    if (animateEntry && data.length > 1) {
      setVisibleDataCount(1)
    }
  }, [chartType, animateEntry])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    if (data.length < 1) return

    // Use only the visible portion of data for animation
    const visibleData = data.slice(0, visibleDataCount)

    // Calculate dimensions
    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    let minValue: number
    let maxValue: number
    let processedData: number[]

    if (isLineChart && !isCandlestickData(data[0])) {
      // Line chart with simple number array
      processedData = visibleData as number[]
      minValue = Math.min(...(data as number[])) // Use full data for scaling
      maxValue = Math.max(...(data as number[]))
    } else if (!isLineChart && isCandlestickData(data[0])) {
      // Candlestick chart
      const candleData = visibleData as CandlestickData[]
      const fullCandleData = data as CandlestickData[]
      minValue = Math.min(...fullCandleData.map(d => d.low)) // Use full data for scaling
      maxValue = Math.max(...fullCandleData.map(d => d.high))
      processedData = candleData.map(d => d.close)
    } else {
      // Convert candlestick to line or vice versa
      if (isCandlestickData(data[0])) {
        processedData = (visibleData as CandlestickData[]).map(d => d.close)
        const fullCandleData = data as CandlestickData[]
        minValue = Math.min(...fullCandleData.map(d => d.low))
        maxValue = Math.max(...fullCandleData.map(d => d.high))
      } else {
        processedData = visibleData as number[]
        minValue = Math.min(...(data as number[]))
        maxValue = Math.max(...(data as number[]))
      }
    }

    const valueRange = maxValue - minValue || 1

    if (isLineChart) {
      // Draw line chart
      drawLineChart(ctx, processedData, padding, chartWidth, chartHeight, minValue, maxValue, valueRange, color, showGradient, width, height, data.length)
    } else {
      // Draw candlestick chart with animation
      drawCandlestickChart(ctx, visibleData as CandlestickData[], padding, chartWidth, chartHeight, minValue, maxValue, valueRange, data.length, visibleDataCount)
    }

  }, [data, visibleDataCount, width, height, color, showGradient, chartType])

  const drawLineChart = (
    ctx: CanvasRenderingContext2D,
    processedData: number[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    _minValue: number,
    maxValue: number,
    valueRange: number,
    color: string,
    showGradient: boolean,
    _canvasWidth: number,
    canvasHeight: number,
    _totalDataPoints?: number
  ) => {
    const points = processedData.map((value, index) => ({
      x: padding + (index / (processedData.length - 1)) * chartWidth,
      y: padding + ((maxValue - value) / valueRange) * chartHeight
    }))

    // Create gradient if needed
    if (showGradient) {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
      gradient.addColorStop(0, `${color}40`)
      gradient.addColorStop(1, `${color}00`)
      
      // Draw filled area
      ctx.beginPath()
      ctx.moveTo(points[0].x, canvasHeight - padding)
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.lineTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.lineTo(points[points.length - 1].x, canvasHeight - padding)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Draw line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach((point, index) => {
      if (index === 0) return
      ctx.lineTo(point.x, point.y)
    })
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points
    points.forEach((point, index) => {
      if (index === points.length - 1) {
        // Highlight last point
        ctx.beginPath()
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
        
        // White inner circle
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      }
    })
  }

  const drawCandlestickChart = (
    ctx: CanvasRenderingContext2D,
    candleData: CandlestickData[],
    padding: number,
    chartWidth: number,
    chartHeight: number,
    _minValue: number,
    maxValue: number,
    valueRange: number,
    totalDataPoints?: number,
    _visibleDataCount?: number
  ) => {
    // Use totalDataPoints for consistent spacing during animation
    const totalPoints = totalDataPoints || candleData.length
    const candleWidth = Math.max(2, chartWidth / totalPoints * 0.6)
    const candleSpacing = chartWidth / totalPoints

    candleData.forEach((candle, index) => {
      const x = padding + (index + 0.5) * candleSpacing
      const openY = padding + ((maxValue - candle.open) / valueRange) * chartHeight
      const closeY = padding + ((maxValue - candle.close) / valueRange) * chartHeight
      const highY = padding + ((maxValue - candle.high) / valueRange) * chartHeight
      const lowY = padding + ((maxValue - candle.low) / valueRange) * chartHeight

      const isGreen = candle.close > candle.open
      const bodyColor = isGreen ? '#10B981' : '#EF4444'
      
      // Draw wick (high-low line)
      ctx.strokeStyle = bodyColor
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // Draw body (open-close rectangle)
      const bodyHeight = Math.abs(closeY - openY) || 1
      const bodyY = Math.min(openY, closeY)
      
      ctx.fillStyle = bodyColor
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight)
      
      // Draw body outline
      ctx.strokeStyle = bodyColor
      ctx.lineWidth = 1
      ctx.strokeRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight)
    })
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  )
}

export default PriceChart