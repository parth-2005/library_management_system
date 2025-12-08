import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone_number:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String, // bcrypt hash
        required: true,
    },
    role:{
        type: String,
        default: 'admin'
    }
});


const Admin_model = mongoose.model('Admin', adminSchema);

export default Admin_model;