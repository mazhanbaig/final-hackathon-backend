const express = require("express")
const cors = require("cors")
const authRoutes=require("./routes/auth.route")
const app = express()

app.use(cors({
    origin: "*",   
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)

connectDB().then(() => console.log("MongoDB connected")).catch(err => console.log(err));

module.exports = app