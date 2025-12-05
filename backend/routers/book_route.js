import express from 'express';
import{
    AddBook, 
    GetBookById, 
    GetBooks, 
    UpdateBookById, 
    DeleteBookById, 
    DeleteBooks  
} from '../controllers/book_controller.js';


const router = express.Router();

router.post('/addbook', AddBook);
router.get('/getbook/:id', GetBookById);
router.get('/getbooks', GetBooks);
router.put('/updatebook/:id', UpdateBookById);
router.delete('/deletebook/:id', DeleteBookById);
router.delete('/delete', DeleteBooks);

export default router;