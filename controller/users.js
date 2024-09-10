const User =require("../models/users");
const bcrypt =require("bcryptjs");
const {promisify}=require('util');
const jwt = require("jsonwebtoken");


const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const jwtSign = promisify(jwt.sign);




exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        logger.error(`Error getting users: ${err.message}`);
        next(err);
    }
};


exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const hashingpass = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashingpass, role: "user" });
        await user.save();
        res.send("User signup done");
    } catch (err) {
        logger.error(`Error during signup: ${err.message}`);
        next(err);
    }
};



exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new AppError(400, "Invalid email or password");

        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
            const token = await jwtSign({ userId: user._id }, "secret", { expiresIn: "5d" });
            res.send({ message: "User logged in", token });
        } else {
            throw new AppError(400, "Invalid email or password");
        }
    } catch (err) {
        logger.error(`Error during login: ${err.message}`);
        next(err);
    }
};



exports.deleteuser = async (req, res, next) => {
    try {
        const deleteduser = req.params.email;
        await User.deleteOne({ email: deleteduser });
        res.send("Deleted user done");
    } catch (err) {
        logger.error(`Error deleting user: ${err.message}`);
        next(err);
    }
};