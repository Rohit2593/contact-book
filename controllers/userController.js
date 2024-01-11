const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// @desc Get all contacts
// @route POST /api/users/register
// @access public

const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const userAvailable = await User.findOne({ email });
    if(userAvailable){
        res.status(400);
        throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("hashed password: ", hashedPassword);

    const user = User.create({
        name,
        email,
        password: hashedPassword,
    })

    if(user){
        res.status(201).json({
            id: user.id,
            email: user.email
        });
    }

    else{
        res.status(400);
        throw new Error("user data not valid");
    }
});

// @desc Log a user in
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("all fields are mandatory");
    }

    const user = await User.findOne({email});

    if(!user){
        res.status(404);
        throw new Error("User not found");
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if(!passwordsMatch){
        res.status(401);
        throw new Error("Passwords don't match");
    }

    // user exists and passwords match

    const accessToken = jwt.sign(
        {
        user: {
                username: user.name,
                email: user.email,
                id: user.id
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m"}
    );
    res.status(200).json({
        accessToken
    });
});

// @desc Get current info of a user
// @route GET /api/users/current
// @access private
const getUserInfo = asyncHandler( async (req, res) => {
    res.json(req.user);
});



module.exports = { registerUser, loginUser, getUserInfo};