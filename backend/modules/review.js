// In public libraries reviews can guide community engagement, but in academic libraries, usage metrics matter more
// This is optional and more relevant for public libraries or digital catalogs. For academic libraries, circulation metrics are primary.



import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    comment: {
        type: String, 
        required: true 
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const Review_model = mongoose.model("Review", reviewSchema);

export default Review_model;