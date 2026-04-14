const app = require("../src/index");

module.exports = async (req, res) => {
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    return app(req, res);
};