const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const ResponseObj = require("../utils/ResponseObj")

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body

        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(400).json(ResponseObj(false, "User already exists", null, "User already exists"))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email,
            password: hashedPassword
        })

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(201).json(ResponseObj(true, "Registration successful", { user, token }, "Registration successful"))

    } catch (error) {
        res.status(500).json(ResponseObj(false, "Server error", null, error.message))
    }
})


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json(ResponseObj(false, "Invalid credentials", null, "Invalid credentials"))
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json(ResponseObj(false, "Invalid credentials", null, "Invalid credentials"))
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.json(ResponseObj(true, "Login successful", { user, token }, null))

    } catch (error) {
        res.status(500).json(ResponseObj(false, "Server error", null, error.message))
    }
})

module.exports = router