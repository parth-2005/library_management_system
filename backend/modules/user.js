import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone_number:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    createdByAdmin: {
        type: Boolean,
        default: false,        
    },
});

const User_model = mongoose.model("User", userSchema);

export default User_model;