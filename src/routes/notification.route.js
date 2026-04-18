const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/authmiddleware");
const Notification = require("../models/Notification");
const ResponseObj = require("../utils/ResponseObj");

router.use(checkAuth);

// GET all notifications for user
router.get("/", async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        const unreadCount = notifications.filter(n => !n.read).length;

        res.json(ResponseObj(true, "Notifications", { notifications, unreadCount }, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// MARK as read
router.put("/:id/read", async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json(ResponseObj(true, "Marked as read", null, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

// MARK all as read
router.put("/read-all", async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
        res.json(ResponseObj(true, "All marked as read", null, null));
    } catch (error) {
        res.status(500).json(ResponseObj(false, "Error", null, error.message));
    }
});

module.exports = router;