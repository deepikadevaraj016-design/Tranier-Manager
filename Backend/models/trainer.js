const mongoose = require("mongoose")

const trainerschema =  new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    email: String,
    phone: String,
    course: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    notes: String,
},
{ timestamps: true })

module.exports = mongoose.model("trainer",trainerschema)