import mongoose from "mongoose";
var Schema= mongoose.Schema
const {ObjectId}= mongoose.Schema.Types


const employSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        },
    age:{
        type:Number
    },
    city:{
        type:String
    },
    salary:{
        type:Number,
        },
        postedby:{
            type:ObjectId,
            ref:"homeAuthManagement"
            },

},{versionKey: false})


const Employ=mongoose.model('employ',employSchema)


export default Employ