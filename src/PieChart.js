import React, { useEffect, useRef } from "react"
import { Chart } from "chart.js/auto"

const PieChart = ({ data }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d")
    const labels = data.map((d) => d.fuel)
    const percentages = data.map((d) => d.perc)
    const colors = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(199, 199, 199, 0.2)",
      "rgba(83, 102, 255, 0.2)",
      "rgba(83, 159, 64, 0.2)",
    ]

    const borderColors = colors.map((color) => color.replace("0.2", "1"))

    const myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "Electricity Grid Mix",
            data: percentages,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
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
    <div style={{ width: "300px", height: "300px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default PieChart
