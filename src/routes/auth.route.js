// const express = require("express")
// const router = express.Router()
// const bcrypt = require("bcryptjs")
// const jwt = require("jsonwebtoken")
// const User = require("../models/User")
// const ResponseObj = require("../utils/ResponseObj")
// const checkAuth = require("../middlewares/authmiddleware")

// // REGISTER
// router.post("/register",async (req, res) => {
//     try {
//         const { name, email, password } = req.body
//         console.log("BODY:", req.body)
//         const userExists = await User.findOne({ email })

//         if (userExists) {
//             return res.status(400).json(ResponseObj(false, "User already exists", null, "User already exists"))
//         }

//         const hashedPassword = await bcrypt.hash(password, 10)

//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword
//         })

//         const token = jwt.sign(
//             { id: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         )

//         res.status(201).json(ResponseObj(true, "Registration successful", { user, token }, "Registration successful"))

//     } catch (error) {
//         res.status(500).json(ResponseObj(false, "Server error", null, error.message))
//     }
// })


// // LOGIN
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body

//         const user = await User.findOne({ email })

//         if (!user) {
//             return res.status(400).json(ResponseObj(false, "Invalid credentials", null, "Invalid credentials"))
//         }

//         const isMatch = await bcrypt.compare(password, user.password)

//         if (!isMatch) {
//             return res.status(400).json(ResponseObj(false, "Invalid credentials", null, "Invalid credentials"))
//         }

//         const token = jwt.sign(
//             { id: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         )

//         res.json(ResponseObj(true, "Login successful", { user, token }, null))

//     } catch (error) {
//         res.status(500).json(ResponseObj(false, "Server error", null, error.message))
//     }
// })

// module.exports = router





const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ResponseObj = require("../utils/ResponseObj");
const checkAuth = require("../middlewares/authmiddleware");
const { suggestSkills } = require("../utils/aiHelpers");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json(ResponseObj(false, "User already exists", null, "User already exists"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "both"
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json(ResponseObj(true, "Registration successful", { user: { id: user._id, name: user.name, email: user.email }, token }, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Server error", null, error.message));
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json(ResponseObj(false, "Invalid credentials", null, "Invalid credentials"));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(ResponseObj(false, "Invalid credentials", null, "Invalid credentials"));
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json(ResponseObj(true, "Login successful", { user: { id: user._id, name: user.name, email: user.email, role: user.role, isOnboarded: user.isOnboarded }, token }, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Server error", null, error.message));
    }
});

// COMPLETE ONBOARDING with AI suggestions
router.post("/onboarding", checkAuth, async (req, res) => {
    try {
        const { skills, interests, location } = req.body;

        // AI: Suggest skills based on interests
        const aiSuggestedSkills = suggestSkills(interests || []);

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                skills: skills || [],
                interests: interests || [],
                location: location || "",
                isOnboarded: true
            },
            { new: true }
        ).select("-password");

        res.json(ResponseObj(true, "Onboarding complete", { user, aiSuggestedSkills }, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Server error", null, error.message));
    }
});

module.exports = router;