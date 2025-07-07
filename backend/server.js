import { JSONFilePreset } from "lowdb/node"
import express from "express"
import bodyParser from "body-parser"
import nodemailer from "nodemailer"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"

dotenv.config()
const app = express()
const port = 8080

app.use(cors())
app.use(bodyParser.json())

// Store user email + location
const defaultData = { users: [] }
const db = await JSONFilePreset("db.json", defaultData)

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
app.post("/user", async (req, res) => {
  await db.read()
  const { email, location } = req.body
  if (!email || !location) {
    return res.status(400).json({ error: "Email and location are required" })
  }
  // Check if user already exists
  const normailisedEmail = email.trim().toLowerCase()
  const existingUser = db.data.users.find((user) => user.email === normailisedEmail)
  if (existingUser) {
    return res.status(400).json({ error: "User already subscribed" })
  }

  db.data.users.push({ email: normailisedEmail, location })
  await db.write()
  res.status(200).json({ success: true, message: "Subscribed successfully" })
})

async function getRegionalCarbonIntensity(location) {
  console.log("Fetching carbon intensity")
  try {
    const now = new Date().toISOString()
    const url = `https://api.carbonintensity.org.uk/regional/intensity/${now}/fw24h/postcode/${location}`
    const response = await axios.get(url)
    console.log("Response received:", response.data.data.data[0].intensity.forecast)
    return response.data.data.data[0].intensity.forecast
  } catch (error) {
    console.error("Error fetching carbon intensity:", error)
    return null
  }
}

async function checkCarbonAndSendEmail() {
  console.log("Checking carbon intensity for users...")
  await db.read()
  for (const { email, location } of db.data.users) {
    const carbonIntensity = await getRegionalCarbonIntensity(location)

    if (carbonIntensity && carbonIntensity < 110) {
      sendReminderEmail(email, location, carbonIntensity)
    }
  }
}

// send email alert
async function sendReminderEmail(email, location, intensity) {
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

// Run check every 30 minute
setInterval(checkCarbonAndSendEmail, 30 * 60 * 1000)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
