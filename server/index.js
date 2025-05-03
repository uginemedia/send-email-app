const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

// Access-Control-Allow-Origin middleware
// This middleware allows cross-origin requests to your server
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Specify allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Specify allowed headers
    next();
  });

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded (form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Gmail SMTP Resuable Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

app.get("/", (req, res) => {
    res.send("Hello from the server!");
})


app.post("/send-email", (req, res) => {
  // Validate request body
  if (!req.body.email || !req.body.subject || !req.body.text) {
    return res.status(400).send("Missing required fields: email, subject, text");
  }

  // Send email using nodemailer
  const mailOPtions = {
    from: process.env.AUTH_EMAIL,
    to: req.body.email,
    subject: req.body.subject,
    text: req.body.text,
  }

  // Send email using nodemailer
  transporter.sendMail(mailOPtions, (error, info) => {
    if(error) return res.status(500).send("Error: ", error);
    console.log("Email sent: ", info.response);
    res.status(200).send("Email sent successfully!");
  })
})

// Start the server
// Make sure to use the correct port number
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});