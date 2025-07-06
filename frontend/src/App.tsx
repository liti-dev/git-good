import { useState, useId } from "react"
import { WebsiteCarbonBadge } from "react-websitecarbon-badge"
import { getIntensity, postUserData } from "./api/api"
import LocationForm from "./components/LocationForm"
import Stat from "./components/Stat"

export default function App() {
  const [location, setLocation] = useState("")
  const [email, setEmail] = useState("")
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
    try {
      const intensity = await getIntensity(location)
      setStat(intensity)
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
      {stat && <Stat stat={stat} />}
      <WebsiteCarbonBadge url="https://git-good-pi.vercel.app/" />
    </div>
  )
}
