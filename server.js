// require('dotenv').config()
// const connectDB = require('./src/config/db')
// const app = require("./src/index")

// connectDB()
// .then((res) => {
//     app.listen(5000, () => {
//         console.log("Server running at 5000")
//     })
// })
// .catch((error) => {
//     console.log('Error while connecting DB')
// })

require('dotenv').config()
const connectDB = require('./src/config/db')
const app = require("./src/index")

let isConnected = false;

async function init() {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
        console.log("DB Connected");
    }
}

// For Vercel (serverless)
module.exports = async (req, res) => {
    await init();
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