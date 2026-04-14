const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth.route")
const connectDB = require("./config/db")

const app = express()

const allowedOrigins = [
    "https://final-hackathon-xi-sandy.vercel.app/",
    "http://localhost:3000/"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)

connectDB()
    .then(() => console.log("DB connected"))
    .catch(err => console.log(err));
    
module.exports = app