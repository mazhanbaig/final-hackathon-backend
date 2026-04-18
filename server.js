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


require("dotenv").config();
const app = require("./src/index");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        console.log("✅ DB connected");
        app.listen(PORT, "0.0.0.0", () => {
            console.log("🚀 Server running on port " + PORT);
        });
    })
    .catch((err) => {
        console.log("❌ DB connection failed:", err);
    });






// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTMyYzBjYTk1ZjJiNWQ1MDIxZTY5MyIsImlhdCI6MTc3NjQ5NTYyOSwiZXhwIjoxNzc3MTAwNDI5fQ._TkH4InQnf7oa4uVp1lakm2Ue16gSRlAP54CLYqjNZI