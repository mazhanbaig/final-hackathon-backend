// require("dotenv").config();
// const app = require("./src/index");
// const connectDB = require("./src/config/db");

// const PORT = process.env.PORT || 5000;

// connectDB()
//     .then(() => {
//         app.listen(PORT, "0.0.0.0", () => {
//             console.log("Server running on port " + PORT);
//         });
//     })
//     .catch((err) => {
//         console.log("DB connection failed:", err);
//     });


// require("dotenv").config();
// const app = require("./src/index");
// const connectDB = require("./src/config/db");

// const PORT = process.env.PORT || 5000;

// connectDB()
//     .then(() => {
//         console.log("✅ DB connected");
//         app.listen(PORT, "0.0.0.0", () => {
//             console.log("🚀 Server running on port " + PORT);
//         });
//     })
//     .catch((err) => {
//         console.log("❌ DB connection failed:", err);
//     });





require("dotenv").config();
const connectDB = require("./src/config/db");

// ✅ CRITICAL: Register models BEFORE connecting to DB or importing app
console.log("📦 Registering models...");
require("./src/models/User");
require("./src/models/Request");
require("./src/models/Message");
require("./src/models/Notification");

console.log("✅ Registered models:", mongoose.modelNames());

// Now import the app
const app = require("./src/index");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        console.log("📦 Available models:", mongoose.modelNames());

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTMyYzBjYTk1ZjJiNWQ1MDIxZTY5MyIsImlhdCI6MTc3NjQ5NTYyOSwiZXhwIjoxNzc3MTAwNDI5fQ._TkH4InQnf7oa4uVp1lakm2Ue16gSRlAP54CLYqjNZI