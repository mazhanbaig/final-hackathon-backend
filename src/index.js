const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth.route")
const connectDB = require("./config/db")  // Keep this import if needed elsewhere

const app = express()

app.use(cors({
    origin: ["http://localhost:3000", "https://final-hackathon-xi-sandy.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)

module.exports = app