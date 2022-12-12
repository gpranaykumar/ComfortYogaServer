const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0, //0 = user, 1= admin
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
    },
    status: {
        type: String,
        default: "inActive"
    },
    lastPayment:  {
        type: Date,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/pranaykumar/image/upload/v1630863775/avatar/user_avatar_cqwtmb.jpg"
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Users",userSchema)