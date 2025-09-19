const mongoose = require('mongoose')

const batchSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },

    intime:{
        type:String,
        require:true
    },
    outtime:{
        type:String,
        require:true
    },
    trainer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"trainer",
        require:true
    },

    course:{
       id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course",
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }
}, { timestamps: true })

module.exports = mongoose.model("batch",batchSchema)