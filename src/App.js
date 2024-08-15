import { useEffect, useState, useId } from "react"

import LineChart from "./LineChart"
import PieChart from "./PieChart"

export default function App() {
  const [location, setLocation] = useState("")
  const [email, setEmail] = useState("")
  const [stat, setStat] = useState(null)
  const userId = useId()

  function handleSubmit(e) {
    e.preventDefault()

    if (!location) return
    if (email) {
      const regex =
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
      if (regex.test(email)) {
        const user = {
          id: userId,
          location,
          email,
        }
        console.log("sending to backend", user)
        postUserData(user)
      } else {
        alert("Invalid email")
      }
    }
    setLocation(location)
    getIntensity(location)
  }

  // Send user data to backend if there's email
  async function postUserData(data) {
    try {
      const response = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Success:", result)
      } else {
        console.error("Error:", response.statusText)
      }
    } catch (error) {
      console.error("Error:", error)
    }
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
      <LocationForm
        location={location}
        setLocation={setLocation}
        handleSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
      />
      {stat && <Stat location={location} stat={stat} />}
    </div>
  )
}

function LocationForm({ location, setLocation, handleSubmit, email, setEmail }) {
  return (
    <div className="container">
      <h2>💡Coding-related activities consume electricity.</h2>
      <h2>Save the capybaras by choosing the ideal time to push your code!</h2>
      <form onSubmit={handleSubmit}>
        <label for="postcode">Enter your regional postcode (i.e. RG41 or SW1)</label>
        <input
          type="text"
          id="postcode"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label htmlFor="email">And email address if you want a reminder of time to push code</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Get Carbon Intensity</button>
      </form>
    </div>
  )
}

function Stat({ stat }) {
  const generationmix = stat.data[0].generationmix

  return (
    <div className="container">
      <h2>
        Current Carbon Intensity in {stat.shortname} is {stat.data[0].intensity.index}.
      </h2>
      <h2>
        {stat.data[0].intensity.index === "low" || "very low"
          ? " Push your code!"
          : " Now it's not the best time. Come back later or we'll send you a notification."}
      </h2>
      <PieChart data={generationmix} />
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
