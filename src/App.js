import { useEffect, useState } from "react"

import LineChart from "./LineChart"

function LocationForm({ location, setLocation, handleSubmit }) {
  return (
    <div className="container">
      <h2>Let's make an impact! Save the capybaras now!</h2>
      <form onSubmit={handleSubmit}>
        <label for="postcode">Enter your regional postcode (i.e. RG41 or SW1)</label>
        <input
          type="text"
          id="postcode"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label for="email">And email address if you want a reminder of time to push code</label>
        <input type="email" id="email" pattern=".+@example\.com" size="30" />
        <button type="submit">Get Carbon Intensity</button>
      </form>
    </div>
  )
}
function Stat({ stat }) {
  return (
    <div className="container">
      <h2>
        Current Carbon Intensity in {stat.shortname} is {stat.data[0].intensity.index}. Push your
        code!
      </h2>
      <h2>24hrs forecast of Carbon Intensity in {stat.shortname}</h2>
      <LineChart data={stat.data} />

      {/* {stat.data.map((d) => (
        <p>
          {d.intensity.forecast} {d.intensity.index}
        </p>
      ))} */}
    </div>
  )
}

export default function App() {
  const [location, setLocation] = useState("")
  const [stat, setStat] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()

    if (!location) return
    setLocation(location)
    getIntensity(location)
  }

  // Get carbon intensity by location
  async function getIntensity(location) {
    const now = new Date().toISOString()
    // console.log(now);
    try {
      const res = await fetch(
        `https://api.carbonintensity.org.uk/regional/intensity/${now}/fw24h/postcode/${location}`
      )
      const data = await res.json()
      setStat(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <img src="/capylogo.svg" alt="capybara logo" id="logo" />
      <LocationForm location={location} setLocation={setLocation} handleSubmit={handleSubmit} />
      {stat && <Stat location={location} stat={stat} />}
    </div>
  )
}
