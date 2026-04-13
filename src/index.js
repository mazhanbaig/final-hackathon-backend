const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth.route")
const connectDB=require("./config/db")

const app = express()

app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)

module.exports = app