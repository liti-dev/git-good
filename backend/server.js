const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const cors = require("cors")
const dotenv = require("dotenv")
const axios = require("axios")

dotenv.config()
const app = express()
const port = 8080

app.use(cors())
app.use(bodyParser.json())

// Store user email + location subscriptions
const users = []

// Create email transporter
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Route to subscribe users with location + email
app.post("/user", (req, res) => {
  console.log("Received request at /user", req.body)

  const { email, location } = req.body
  if (!email || !location) {
    return res.status(400).json({ error: "Email and location are required" })
  }

  users.push({ email, location })
  res.status(200).json({ success: true, message: "Subscribed successfully" })
})

// fetch carbon intensity for a location
async function getRegionalCarbonIntensity(location) {
  console.log("Fetching carbon intensity")
  try {
    const now = new Date().toISOString()
    const url = `https://api.carbonintensity.org.uk/regional/intensity/${now}/fw24h/postcode/${location}`
    const response = await axios.get(url)
    console.log("Response received:", response.data.data.data[0].intensity.forecast)
    return response.data.data.data[0].intensity.forecast // Extract intensity value
  } catch (error) {
    console.error("Error fetching carbon intensity:", error)
    return null
  }
}

// check carbon intensity & send alerts
async function checkCarbonAndTriggerWebhooks() {
  console.log("Checking carbon intensity for users...")
  for (const { email, location } of users) {
    const carbonIntensity = await getRegionalCarbonIntensity(location)

    if (carbonIntensity && carbonIntensity < 110) {
      sendEmailAlert(email, location, carbonIntensity)
    }
  }
}

// send email alert
async function sendEmailAlert(email, location, intensity) {
  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `⚠️ Low Carbon Intensity Alert in ${location}`,
    text: `The current carbon intensity in ${location} is low: ${intensity} gCO₂/kWh.
You can proceed with energy-intensive tasks. 🌍💚`,
  }

  try {
    console.log("Sending email to:", email)
    await transporter.sendMail(message)
    console.log(`Email sent to ${email} for ${location}`)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

// Run check every 10 minute
setInterval(checkCarbonAndTriggerWebhooks, 10 * 60 * 1000)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
