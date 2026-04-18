const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/authmiddleware");
const Message = require("../models/Message");
const ResponseObj = require("../utils/ResponseObj");

router.use(checkAuth);

// SEND message
router.post("/send", async (req, res) => {
    try {
        const { requestId, to, message } = req.body;

        const newMessage = await Message.create({
            requestId,
            from: req.user._id,
            to,
            message
        });

        res.json(ResponseObj(true, "Message sent", newMessage, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// GET messages for a request
router.get("/request/:requestId", async (req, res) => {
    try {
        const messages = await Message.find({ requestId: req.params.requestId })
            .populate("from", "name")
            .populate("to", "name")
            .sort({ createdAt: 1 });

        res.json(ResponseObj(true, "Messages fetched", messages, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// GET conversations for current user
router.get("/conversations", async (req, res) => {
    try {
        const conversations = await Message.find({
            $or: [{ from: req.user._id }, { to: req.user._id }]
        })
            .populate("from", "name")
            .populate("to", "name")
            .sort({ createdAt: -1 });

        res.json(ResponseObj(true, "Conversations fetched", conversations, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

module.exports = router;