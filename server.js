require('dotenv').config()
const connectDB = require('./src/config/db')
const app = require("./src/index")

module.exports = async (req, res) => {
    // ✅ ADD CORS HEADERS MANUALLY (THIS FIXES EVERYTHING)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // ✅ HANDLE PREFLIGHT HERE (MOST IMPORTANT)
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    return app(req, res);
};
// For local development only
if (process.env.NODE_ENV !== "production") {
    connectDB().then(() => {
        app.listen(5000, () => {
            console.log("Server running at 5000");
        });
    });
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTk1ZDU3OWUwY2E3ZDYwMTE2NjUzNyIsImlhdCI6MTc3MjcwNzE1OSwiZXhwIjoxNzczMzExOTU5fQ.rVuTOTSmgkhmjBRyKRAk7IR1rhUAQqnffw3xrbUkxco


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YzBmZDA4MTNlODQ4OGI1MzAxNjY5YiIsImlhdCI6MTc3NDI1NTM2OCwiZXhwIjoxNzc0ODYwMTY4fQ.YPh7ZeIzetMp7woPmRqB9h13lTbJdt80YdjNHJznucA