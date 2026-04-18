const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/authmiddleware");
const Request = require("../models/Request");
const User = require("../models/User");
const Notification = require("../models/Notification");
const ResponseObj = require("../utils/ResponseObj");
const { autoCategorize, suggestTags, detectUrgency } = require("../utils/aiHelpers");

router.use(checkAuth);

// CREATE request (with AI features)
router.post("/create", async (req, res) => {
    try {
        let { title, description, category, urgency, tags } = req.body;

        // AI Features
        if (!category) category = autoCategorize(title, description);
        if (!urgency) urgency = detectUrgency(title, description);
        if (!tags || tags.length === 0) tags = suggestTags(title, description);

        const request = await Request.create({
            title,
            description,
            category,
            urgency,
            tags,
            createdBy: req.user._id,
            aiSuggestions: {
                suggestedCategory: category,
                suggestedTags: tags,
                urgencyScore: urgency
            }
        });

        await request.populate("createdBy", "name trustScore");

        res.status(201).json(ResponseObj(true, "Request created", request, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// GET all requests (with filters for Explore page)
router.get("/all", async (req, res) => {
    try {
        const { category, urgency, skill, search } = req.query;
        let filter = { status: "open" };

        if (category && category !== "all") filter.category = category;
        if (urgency && urgency !== "all") filter.urgency = urgency;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        let requests = await Request.find(filter)
            .populate("createdBy", "name trustScore skills location")
            .populate("helpers", "name trustScore")
            .sort({ createdAt: -1 });

        // Filter by skill if provided
        if (skill && skill !== "all") {
            requests = requests.filter(req =>
                req.createdBy.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()))
            );
        }

        res.json(ResponseObj(true, "Requests fetched", requests, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// GET single request (for Detail page)
router.get("/:id", async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate("createdBy", "name email trustScore skills location")
            .populate("helpers", "name trustScore skills");

        if (!request) return res.status(404).json(ResponseObj(false, "Not found", null, null));

        res.json(ResponseObj(true, "Request found", request, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// OFFER help
router.post("/:id/offer-help", async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json(ResponseObj(false, "Not found", null, null));

        if (!request.helpers.includes(req.user._id)) {
            request.helpers.push(req.user._id);
            request.status = "in-progress";
            await request.save();

            // Create notification
            await Notification.create({
                userId: request.createdBy,
                title: "Someone wants to help!",
                message: `${req.user.name} offered help on "${request.title}"`,
                type: "help_offered"
            });
        }

        res.json(ResponseObj(true, "Help offered successfully", request, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// MARK as solved/resolved
router.put("/:id/mark-solved", async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json(ResponseObj(false, "Not found", null, null));

        if (request.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json(ResponseObj(false, "Only creator can mark as solved", null, null));
        }

        request.status = "resolved";
        request.resolvedBy = req.user._id;
        await request.save();

        // Update trust scores
        await User.findByIdAndUpdate(req.user._id, { $inc: { totalHelpReceived: 1, trustScore: 5 } });

        if (request.helpers.length > 0) {
            await User.findByIdAndUpdate(request.helpers[0], { $inc: { totalHelpGiven: 1, trustScore: 10 } });

            // Notify helper
            await Notification.create({
                userId: request.helpers[0],
                title: "Request Solved!",
                message: `The request "${request.title}" was marked as solved. Great job!`,
                type: "request_resolved"
            });
        }

        res.json(ResponseObj(true, "Request marked as solved", request, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// GET my requests (for Dashboard)
router.get("/my/requests", async (req, res) => {
    try {
        const requests = await Request.find({ createdBy: req.user._id })
            .populate("helpers", "name")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json(ResponseObj(true, "Your requests", requests, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// GET requests I'm helping
router.get("/my/helping", async (req, res) => {
    try {
        const requests = await Request.find({ helpers: req.user._id, status: { $ne: "resolved" } })
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.json(ResponseObj(true, "Requests you're helping", requests, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});




// ACCEPT a helper
router.put("/:id/accept-helper", async (req, res) => {
    try {
        const { helperId } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) return res.status(404).json(ResponseObj(false, "Not found", null, null));
        if (request.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json(ResponseObj(false, "Only creator can accept helpers", null, null));
        }

        // Update helper status
        const helperIndex = request.helpers.findIndex(h => h.toString() === helperId);
        if (helperIndex !== -1) {
            // You can add a status field to helpers array
            request.acceptedHelper = helperId;
            request.status = "in-progress";
            await request.save();
        }

        res.json(ResponseObj(true, "Helper accepted", request, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// DECLINE a helper
router.put("/:id/decline-helper", async (req, res) => {
    try {
        const { helperId } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) return res.status(404).json(ResponseObj(false, "Not found", null, null));
        if (request.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json(ResponseObj(false, "Only creator can decline helpers", null, null));
        }

        // Remove helper from list
        request.helpers = request.helpers.filter(h => h.toString() !== helperId);
        await request.save();

        res.json(ResponseObj(true, "Helper declined", request, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

module.exports = router;