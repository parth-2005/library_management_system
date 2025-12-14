import express from 'express';
import upload from '../middleware/bookImg_middleware.js';
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

// Public route - anyone can view books
router.get('/getbooks', GetBooks);

// Authenticated routes
router.use(authRequired);
router.get('/getbook/:id', GetBookById);

// Admin only mutations
router.post('/addbook', requireAdmin,upload.single("book_cover"),AddBook);
router.put('/updatebook/:id', requireAdmin, UpdateBookById);
router.delete('/deletebook/:id', requireAdmin, DeleteBookById);
router.delete('/delete', requireAdmin, DeleteBooks);

export default router;