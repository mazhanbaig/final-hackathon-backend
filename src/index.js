const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth.route")
const connectDB=require("./config/db")

const app = express()

app.use(cors({
    origin: ["https://final-hackathon-xi-sandy.vercel.app","http://localhost:3000/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)

connectDB().then((res)=>console.log("db connected")).catch((error)=>console.log(error))

module.exports = app