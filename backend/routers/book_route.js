import express from 'express';
import{
    AddBook, 
    GetBookById, 
    GetBooks, 
    UpdateBookById, 
    DeleteBookById, 
    DeleteBooks  
} from '../controllers/book_controller.js';
import { authRequired, requireAdmin } from '../middleware/auth_middleware.js';

const router = express.Router();

// Anyone authenticated can view books
router.use(authRequired);
router.get('/getbook/:id', GetBookById);
router.get('/getbooks', GetBooks);

// Admin only mutations
router.post('/addbook', requireAdmin, AddBook);
router.put('/updatebook/:id', requireAdmin, UpdateBookById);
router.delete('/deletebook/:id', requireAdmin, DeleteBookById);
router.delete('/delete', requireAdmin, DeleteBooks);

export default router;