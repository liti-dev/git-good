// LineChart.js
import React, { useEffect, useRef } from "react"
import { Chart } from "chart.js/auto"

import "../index.css"

interface LineChartProps {
  data: Array<{
    intensity: {
      forecast: number
      index: string
    }
  }>
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!chartRef.current) return
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return
    const forecastData = data.map((d) => d.intensity.forecast)
    const indexData = data.map((d) => d.intensity.index)
    let bgColors = indexData.map((i) => getBgColor(i))
    console.log(bgColors)

    function getBgColor(i: string) {
      switch (i) {
        case "very low":
          return (i = "#93CC3A")

        case "low":
          return (i = "#588157")

        case "moderate":
          return (i = "#E1B28E")

        case "high":
          return (i = "#CC5A03")

        default:
          return (i = "#93CC3A")
      }
    }

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: indexData,
        datasets: [
          {
            label: "Carbon Intensity (gCO2/kWh)",
            data: forecastData,
            backgroundColor: "#93CC3A",
            borderColor: bgColors,
            pointBackgroundColor: bgColors,
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "",
            },
          },
          y: {
            title: {
              display: true,
              text: "Carbon Intensity",
            },
          },
        },
      },
    })

    // Cleanup on unmount
    return () => {
      myChart.destroy()
    }
  }, [data])

  return (
    <div style={{ width: "100%" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default LineChart
