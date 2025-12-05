import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    book_title:{
        type:String,
        required:true
    },
    book_author:{
        type:String,
        required:true
    },
    book_language:{
        type:String,
        required:true
    },
    book_price:{
        type:String,
        required:true
    },
    book_added_at:{
        type:String,

    },
    book_quantity:{
        type:Number,
        required:true
    }
});

const Book_model = mongoose.model("Book", bookSchema);

export default Book_model;