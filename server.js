// // require('dotenv').config()
// // const connectDB = require('./src/config/db')
// // const app = require("./src/index")

// // connectDB()
// // .then((res) => {
// //     app.listen(5000, () => {
// //         console.log("Server running at 5000")
// //     })
// // })
// // .catch((error) => {
// //     console.log('Error while connecting DB')
// // })

// require('dotenv').config()
// const connectDB = require('./src/config/db')
// const app = require("./src/index")

// // module.exports = async (req, res) => {
// //     return app(req, res);
// // };

// module.exports = async (req, res) => {
//     // ✅ HANDLE PREFLIGHT FIRST
//     if (req.method === "OPTIONS") {
//         return res.status(200).end();
//     }

//     return app(req, res);
// };

// // For local development only
// if (process.env.NODE_ENV !== "production") {
//     connectDB().then(() => {
//         app.listen(5000, () => {
//             console.log("Server running at 5000");
//         });
//     });
// }

// // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTk1ZDU3OWUwY2E3ZDYwMTE2NjUzNyIsImlhdCI6MTc3MjcwNzE1OSwiZXhwIjoxNzczMzExOTU5fQ.rVuTOTSmgkhmjBRyKRAk7IR1rhUAQqnffw3xrbUkxco


// // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YzBmZDA4MTNlODQ4OGI1MzAxNjY5YiIsImlhdCI6MTc3NDI1NTM2OCwiZXhwIjoxNzc0ODYwMTY4fQ.YPh7ZeIzetMp7woPmRqB9h13lTbJdt80YdjNHJznucA




require("dotenv").config();
const app = require("./src/index");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => {
            console.log("Server running on port " + PORT);
        });
    })
    .catch((err) => {
        console.log("DB connection failed:", err);
    });








// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTMyYzBjYTk1ZjJiNWQ1MDIxZTY5MyIsImlhdCI6MTc3NjQ5NTYyOSwiZXhwIjoxNzc3MTAwNDI5fQ._TkH4InQnf7oa4uVp1lakm2Ue16gSRlAP54CLYqjNZI