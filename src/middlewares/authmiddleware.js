const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const ResponseObj = require("../helpers/ResponseObj");

// ------------------ AUTH MIDDLEWARE ------------------
const checkAuth = async (req, res, next) => {
    try {
        let token=req.headers.authorization.split(" ")[1]

        if (!token) {
            return res.status(401).json(
                ResponseObj(false, "Not authorized", null, "No token provided")
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json(
                ResponseObj(false, "User not found", null, "Invalid token")
            );
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json(
            ResponseObj(false, "Something went wrong", null, "Token invalid")
        );
    }
};

module.exports = checkAuth;