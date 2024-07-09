const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()
const app = express()
const port = 8080

app.use(cors())
app.use(bodyParser.json())

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
app.get("/", (req, res) => {
  res.send("Hello World!")
})

// POST endpoint to handle user data and send reminder email
app.post("/user", async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).send("Email is required")
  }

  const message = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Subject",
    text: "It's time to push your code (or to do other energy-consuming activities). Thanks for saving the Capybaras by reducing carbon impact of your code!",
  }
  console.log(message)

  // Send the email
  // try {
  //   await transporter.sendMail(message)
  //   res.status(200).send("Reminder email sent")
  // } catch (error) {
  //   res.status(500).send("Error sending email")
  // }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
