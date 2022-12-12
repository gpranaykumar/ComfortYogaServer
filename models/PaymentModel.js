const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    TransactionId: {
        type: String,
        required: true,
        unique: true
    },
    batch: {
        type: String,
    },
    status: {
        type: String,
    },
    name: {
        type: String,
    },
    date: {
        type: Date,
        default: new Date(),
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Payments",paymentSchema)