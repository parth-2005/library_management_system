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
import { AddReview, DeleteReview } from '../controllers/review_controller.js';
import { authRequired, requireAdmin, requireUser } from '../middleware/auth_middleware.js';

const router = express.Router();

// Public route - anyone can view books
router.get('/getbooks', GetBooks);
router.get('/getbook/:id', GetBookById);

// Authenticated routes
router.use(authRequired);
router.post('/:bookId/reviews',authRequired, AddReview);
router.delete('/reviews/:reviewId',authRequired, DeleteReview);

// Admin only mutations
router.post('/addbook', requireAdmin,upload.single("book_cover"),AddBook);
router.put('/updatebook/:id', requireAdmin, UpdateBookById);
router.delete('/deletebook/:id', requireAdmin, DeleteBookById);
router.delete('/delete', requireAdmin, DeleteBooks);

export default router;