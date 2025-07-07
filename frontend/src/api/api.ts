export async function postUserData(data: { id: string; location: string; email: string }) {
  // console.log("Preparing to send request", data)
  try {
    const response = await fetch("http://localhost:8080/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    console.log("User data received", response)

    if (response.ok) {
      const result = await response.json()
      console.log("User subscribed successfully:", result)
    } else {
      console.error("Error response from server:", response.status, response.statusText)
    }
  } catch (error) {
    console.error("Network error:", error)
  }
}

export async function getIntensity(location: string) {
  const now = new Date().toISOString()
  try {
    const res = await fetch(
      `https://api.carbonintensity.org.uk/regional/intensity/${now}/fw24h/postcode/${location}`
    )
    const data = await res.json()
    return data.data
  } catch (error) {
    console.log("Error fetching carbon intensity", error)
    throw new Error("Could not get carbon intensity for this postcode")
  }
}
