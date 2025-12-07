import mongoose from 'mongoose';
import { react } from '@vitejs/plugin-react';

const assignmentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  //It tells mongoose that “This ObjectId belongs to the User collection.”
        required: true,
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Book',  //It tells mongoose that “This ObjectId belongs to the book collection.”
        required: true
    },

    issuedDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    dueDate: {
        type: Date,
    },
    rent: {
        type: Number,
        required: true,
    }
});

// the upper schema will automatically give the JSON like this:
// {
//   "_id": "66a123...",
//   "issuedDate": "2025-02-02",
//   "dueDate": "2025-02-12",
//   "rent": 20,
//   "userID": {
//       "_id": "66a98a...",
//       "name": "John Doe",
//       "email": "john@gmail.com",
//       ...
//   },
//   "bookId": {
//       "_id": "66a129...",
//       "book_title": "Harry Potter",
//       "author": "J.K. Rowling",
//       ...
//   }
// }



const Assignment_model = mongoose.model("Assignment", assignmentSchema);
export default Assignment_model;