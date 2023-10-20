const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            // decode token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // return the object filtered without password
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorised , token failed")
        }

    } else {
        res.status(401);
        throw new Error("Not authorised , token absent")
    }
});

module.exports = { protect }