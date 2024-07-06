// LineChart.js
import React, { useEffect, useRef } from "react"
import { Chart } from "chart.js/auto"
import "./index.css"

const LineChart = ({ data }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d")
    const forecastData = data.map((d) => d.intensity.forecast)
    const indexData = data.map((d) => d.intensity.index)

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: indexData,
        datasets: [
          {
            label: "Carbon Intensity (gCO2/kWh)",
            data: forecastData,
            borderColor: "#93CC3A",
            backgroundColor: "#93CC3A",
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

  return <canvas ref={chartRef}></canvas>
}

export default LineChart
