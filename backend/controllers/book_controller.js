import mongoose from 'mongoose';
import Book_model from '../modules/book.js';


export const AddBook = async(req,res) => {
 const {book_title,book_author,book_language,book_price,book_quantity} = req.body;

 try {
    const Book = await Book_model.create({
        book_title,
        book_author,
        book_language,
        book_price,
        book_quantity})
        res.status(201).json({Book})
    }
 catch (error) {
    res.status(500).json({message:error.message})
    console.log(error)
 }
}

export const GetBookById = async(req,res) => {
    const { id } = req.params

    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error:"Book_Not_Found"})
        }
        const Book = await Book_model.findById({_id:id})
        if(!Book){
            return res.status(400).json({error:"Unable to get the Book"})
        }
        else{
            return res.status(200).json({Book});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message})
    }
}

export const GetBooks = async(req,res) => {
    try {
        const Book = await Book_model.find();
        if(Book){
            return res.status(226).json({Book})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:error.message})
    }
}

export const UpdateBookById = async(req,res) => {
const { id }  = req.params

try {
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:"Book_Not_Found"})
        }    
    const Book = await Book_model.findByIdAndUpdate({_id:id},{...req.body},{new:true})
    if(!Book){
        return res.status(400).json({msg:"no such book found to update"})
    }
    else{
        res.status(200).json({Book})
    }

} catch (error) {
    console.log(error)
    res.status(500).json({msg:error.message})
}
}

export const DeleteBookById = async(req,res) =>{
    const {id} = req.params
    try {
        
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(400).json({msg:"Invalid Id"})
    }
    const Book = await Book_model.findByIdAndDelete({_id:id})
    if(!Book){
        return res.status(404).json({msg:"No Book like that exist!"})
    }
    else{
        res.status(200).json({Book})
    }
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:error.message})   
    }
}

export const DeleteBooks = async(req,res) =>{
    try {
    const Book = await Book_model.deleteMany()
    res.status(200).json({msg:"Book deleted:DB cleared"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:error.message})
    }
}
