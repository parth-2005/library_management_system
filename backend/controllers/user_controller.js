import User_model from '../modules/user.js';
import mongoose from 'mongoose';

export const AddUser = async(req,res) => {
    const {username, email,phone_number,password} = req.body;

    try {
        const user = await User_model.create({
            username,
            email,
            phone_number,
            password
        })
        res.status(201).json({user})
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log(error)
    }
}

export const GetUserById = async(req,res) => {
    const { id } = req.params

    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error:"User_Not_Found"})
        }
        const user = await User_model.findById({_id:id})
        if(!user){
            return res.status(400).json({error:"Unable to get the user"})
        }
        else{
            return res.status(200).json({user});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message})
    }
}

export const GetUsers = async(req,res) => {
    try {
        const user = await User_model.find();
        if(user){
            return res.status(226).json({user})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:error.message})
    }
}

export const UpdateUserById = async(req,res) => {
const { id }  = req.params

try {
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:"user_Not_Found"})
        }    
    const user = await User_model.findByIdAndUpdate({_id:id},{...req.body},{new:true})
    if(!user){
        return res.status(400).json({msg:"no such user found to update"})
    }
    else{
        res.status(200).json({user})
    }

} catch (error) {
    console.log(error)
    res.status(500).json({msg:error.message})
}
}

export const DeleteUserById = async(req,res) =>{
    const {id} = req.params
    try {
        
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(400).json({msg:"Invalid Id"})
    }
    const user = await User_model.findByIdAndDelete({_id:id})
    if(!user){
        return res.status(404).json({msg:"No user like that exist!"})
    }
    else{
        res.status(200).json({user})
    }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:error.message})   
    }
}

export const DeleteUsers = async(req,res) =>{
    try {
    const user = await User_model.deleteMany()
    res.status(200).json({msg:"user deleted:DB cleared"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:error.message})
    }
}