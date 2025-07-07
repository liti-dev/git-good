import { useState, useId } from "react"

import { getIntensity, postUserData } from "./api/api"
import LocationForm from "./components/LocationForm"
import Stat from "./components/Stat"

export default function App() {
  const [location, setLocation] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [stat, setStat] = useState(null)
  const userId = useId()

  async function handleSubmit(e: React.FormEvent) {
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
        console.log("Sending to backend", user)
        postUserData(user)
      } else {
        alert("Invalid email")
      }
    }
    setLocation(location)
    setIsLoading(true)
    try {
      const intensity = await getIntensity(location)
      setStat(intensity)
      setIsLoading(false)
    } catch (error) {
      console.log("Error fetching carbon intensity:", error)
      alert("Could not get carbon intensity for this postcode")
      setStat(null)
      setIsLoading(false)
    }
  }

  return (
    <div className="App">
      <main className="container">
        <h2>Keep the capybara chill. Commit your code during low-carbon periods!</h2>
        <LocationForm
          location={location}
          setLocation={setLocation}
          handleSubmit={handleSubmit}
          email={email}
          setEmail={setEmail}
        />
        {isLoading ? <p>Getting carbon intensity...</p> : ""}
        {stat && <Stat stat={stat} />}
      </main>
    </div>
  )
}
