const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    name:{
        type:String,
        required:true,
        trim:true
    }    
},{ timestamps: true }
)
module.exports = mongoose.model("Course",courseSchema)