import Review_model from '../modules/review.js';
import Book_model from '../modules/book.js';

export const AddReview = async(req,res) => {
    
    try {
        if (!req.user || req.user.role !== 'user') {
            return res.status(403).json({ message: 'Only users can add reviews' });
        }

        const {comment} = req.body;
        const book = await Book_model.findById(req.params.bookId)
        if(!book){
            return res.status(404).json({message: 'Book not found'})
        }

        //check if the following user had already reviewed or not!
        const existingReview = await Review_model.findOne({user: req.user.userId, book: book._id});
        if(existingReview){
            return res.status(400).json({message:"You have already added your review"})
        }

        const review = await Review_model.create({
            user: req.user.userId,
            book: book._id,
            comment
        });
        // Link review to book without triggering full book validation
        await Book_model.findByIdAndUpdate(book._id, {
            //here push is used to push the reviews so the mongoDB doesn't re-validate the schema checks as first there were the problemm of giving the book's cover image while posting the review!!
            $push: { book_reviews: review._id }
        });
        res.status(201).json({ message: 'Review added', review });
    
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


// Delete a review

export const DeleteReview = async (req, res) => {
    try {
        const review = await Review_model.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if(!req.user || !req.user.role === 'user'){
            return res.status(403).json({message: "Only review publisher can delete the review!"})
        }

        if (review.user.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Remove review from Book
        await Book_model.findByIdAndUpdate(review.book, { $pull: { book_reviews: review._id } });

        // Delete review
        await Review_model.findByIdAndDelete(review._id);

        res.json({ message: 'Review deleted' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
