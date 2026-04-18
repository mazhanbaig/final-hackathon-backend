const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/authmiddleware");
const User = require("../models/User");
const Request = require("../models/Request");
const ResponseObj = require("../utils/ResponseObj");
const { generateAIInsights, suggestSkills } = require("../utils/aiHelpers");

// GET user profile
router.get("/profile", checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(ResponseObj(true, "Profile found", user, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// UPDATE user profile
router.put("/profile", checkAuth, async (req, res) => {
    try {
        const { skills, interests, location, bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { skills, interests, location, bio },
            { new: true }
        ).select("-password");

        res.json(ResponseObj(true, "Profile updated", user, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// GET dashboard stats & insights
router.get("/dashboard", checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const stats = {
            requestsCreated: await Request.countDocuments({ createdBy: req.user._id }),
            helpOffered: await Request.countDocuments({ helpers: req.user._id }),
            helpResolved: await Request.countDocuments({ resolvedBy: req.user._id }),
            trustScore: user.trustScore,
            totalHelpGiven: user.totalHelpGiven,
            badges: user.badges || []
        };

        const recentRequests = await Request.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        // AI Insights
        const aiInsights = generateAIInsights(user);

        res.json(ResponseObj(true, "Dashboard data", { stats, recentRequests, aiInsights }, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// GET leaderboard (Top helpers)
router.get("/leaderboard", async (req, res) => {
    try {
        const topHelpers = await User.find({ totalHelpGiven: { $gt: 0 } })
            .select("name trustScore totalHelpGiven badges")
            .sort({ totalHelpGiven: -1, trustScore: -1 })
            .limit(10);

        // Add ranks
        const leaderboard = topHelpers.map((user, index) => ({
            rank: index + 1,
            ...user.toObject()
        }));

        res.json(ResponseObj(true, "Leaderboard", leaderboard, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// GET AI suggestions for user
router.get("/ai-suggestions", checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const suggestions = {
            skillsToLearn: suggestSkills(user.interests || []),
            insights: generateAIInsights(user),
            recommendedRequests: await Request.find({
                status: "open",
                category: { $in: user.skills || [] }
            }).limit(3).populate("createdBy", "name")
        };

        res.json(ResponseObj(true, "AI suggestions", suggestions, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

module.exports = router;