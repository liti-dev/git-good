import PieChart from "./PieChart"
import LineChart from "./LineChart"

interface StatProps {
  stat: any
}

export default function Stat({ stat }: StatProps) {
  const generationmix = stat.data[0].generationmix

  return (
    <div className="container">
      <h2>
        Current Carbon Intensity in {stat.shortname} is {stat.data[0].intensity.index}.
      </h2>
      <h2>
        {stat.data[0].intensity.index === "low" || stat.data[0].intensity.index === "very low"
          ? " Push your code!"
          : " Now may be not the best time. We'll send you a reminder email."}
      </h2>
      <PieChart data={generationmix} />
      <h2>24hrs forecast of Carbon Intensity in {stat.shortname}</h2>
      <LineChart data={stat.data} />
    </div>
  )
}
