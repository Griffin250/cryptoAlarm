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
  const containerRef = useRef<HTMLDivElement>(null)

  const [visibleDataCount, setVisibleDataCount] = React.useState(animateEntry ? 1 : data.length)
  
  // Zoom state management
  const [zoomLevel, setZoomLevel] = React.useState(1)
  const [zoomCenter, setZoomCenter] = React.useState(0.5) // 0 = left, 1 = right
  const [panOffset, setPanOffset] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [lastMouseX, setLastMouseX] = React.useState(0)

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

  // Zoom and pan utility functions
  const getZoomedData = (originalData: any[], zoomLevel: number, zoomCenter: number, panOffset: number) => {
    if (zoomLevel <= 1) return originalData

    const dataLength = originalData.length
    const visibleRange = Math.floor(dataLength / zoomLevel)
    
    // Calculate the center point considering pan offset
    let centerIndex = Math.floor(dataLength * zoomCenter) + panOffset
    centerIndex = Math.max(Math.floor(visibleRange / 2), Math.min(centerIndex, dataLength - Math.floor(visibleRange / 2)))
    
    const startIndex = Math.max(0, centerIndex - Math.floor(visibleRange / 2))
    const endIndex = Math.min(dataLength, startIndex + visibleRange)
    
    return originalData.slice(startIndex, endIndex)
  }

  const handleZoom = (delta: number, mouseX: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const zoomFactor = delta > 0 ? 1.15 : 0.85 // Slightly smoother zoom increments
    const newZoomLevel = Math.max(1, Math.min(10, zoomLevel * zoomFactor))
    
    if (newZoomLevel !== zoomLevel) {
      // Calculate new zoom center based on mouse position
      const rect = canvas.getBoundingClientRect()
      const relativeX = (mouseX - rect.left) / rect.width
      setZoomCenter(Math.max(0, Math.min(1, relativeX)))
      setZoomLevel(newZoomLevel)
      
      // Reset pan offset when zooming to avoid confusion
      if (newZoomLevel === 1) {
        setPanOffset(0)
      }
    }
  }

  const handleMouseWheel = (event: WheelEvent) => {
    event.preventDefault()
    handleZoom(-event.deltaY, event.clientX)
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setZoomCenter(0.5)
    setPanOffset(0)
  }

  // Mouse event handlers for panning
  const handleMouseDown = (event: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setLastMouseX(event.clientX)
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const deltaX = event.clientX - lastMouseX
      const panSensitivity = 0.5
      const panDelta = Math.floor(deltaX * panSensitivity)
      setPanOffset(prev => Math.max(-data.length / 2, Math.min(data.length / 2, prev + panDelta)))
      setLastMouseX(event.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch support for mobile zoom
  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 1 && zoomLevel > 1) {
      setIsDragging(true)
      setLastMouseX(event.touches[0].clientX)
    }
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    if (isDragging && event.touches.length === 1 && zoomLevel > 1) {
      event.preventDefault()
      const deltaX = event.touches[0].clientX - lastMouseX
      const panSensitivity = 0.5
      const panDelta = Math.floor(deltaX * panSensitivity)
      setPanOffset(prev => Math.max(-data.length / 2, Math.min(data.length / 2, prev + panDelta)))
      setLastMouseX(event.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Add wheel and keyboard event listeners
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || (event.ctrlKey && event.key === '0')) {
        resetZoom()
      }
    }

    canvas.addEventListener('wheel', handleMouseWheel, { passive: false })
    canvas.addEventListener('keydown', handleKeyDown)
    canvas.setAttribute('tabIndex', '0') // Make canvas focusable for keyboard events
    
    return () => {
      canvas.removeEventListener('wheel', handleMouseWheel)
      canvas.removeEventListener('keydown', handleKeyDown)
    }
  }, [zoomLevel])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    if (data.length < 1) return

    // Use only the visible portion of data for animation
    const animatedData = data.slice(0, visibleDataCount)
    // Apply zoom and pan to the animated data
    const visibleData = getZoomedData(animatedData, zoomLevel, zoomCenter, panOffset)

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

  }, [data, visibleDataCount, width, height, color, showGradient, chartType, zoomLevel, zoomCenter, panOffset])

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
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full cursor-grab"
        style={{ maxWidth: '100%', height: 'auto', cursor: isDragging ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 flex flex-col space-y-1 z-10 opacity-80 hover:opacity-100 transition-opacity">
        <button
          onClick={() => handleZoom(1, width / 2)}
          disabled={zoomLevel >= 10}
          className="bg-gray-900/90 hover:bg-gray-800 disabled:bg-gray-700/50 disabled:cursor-not-allowed rounded-md p-2 transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm"
          title="Zoom In (Mouse Wheel)"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <button
          onClick={() => handleZoom(-1, width / 2)}
          disabled={zoomLevel <= 1}
          className="bg-gray-900/90 hover:bg-gray-800 disabled:bg-gray-700/50 disabled:cursor-not-allowed rounded-md p-2 transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm"
          title="Zoom Out (Mouse Wheel)"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        {zoomLevel > 1 && (
          <button
            onClick={resetZoom}
            className="bg-blue-600/80 hover:bg-blue-500 rounded-md p-2 transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm"
            title="Reset Zoom (Esc or Ctrl+0)"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Zoom Level Indicator */}
      {zoomLevel > 1 && (
        <div className="absolute bottom-2 left-2 bg-gray-900/90 rounded-lg px-3 py-1.5 text-xs text-gray-300 shadow-lg backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center space-x-2">
            <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-medium">{zoomLevel.toFixed(1)}x</span>
            {isDragging && <span className="text-blue-400 animate-pulse">●</span>}
          </div>
        </div>
      )}
      
      {/* Instructions overlay for first-time users */}
      {zoomLevel === 1 && (
        <div className="absolute bottom-2 right-2 bg-gray-900/80 rounded-lg px-3 py-1.5 text-xs text-gray-400 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Scroll to zoom</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceChart