const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "Please add the user name"],
        },

        email:{
            type: String,
            required: [true, "Please add the user email adress"],
            unique: [true, "email already registered"]
        },

        password: {
            type: String,
            required: [true, "Please provide the password"]
        }
    },

    {
        timestamps: true
    },
)

module.exports = mongoose.model("user", userSchema);