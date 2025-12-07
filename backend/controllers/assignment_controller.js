import Assignment_model from '../modules/assignment.js';
import Book_model from '../modules/assignment.js'
import User_model from '../modules/user';


export const AssignBook = async (req,res) => {
    const {userId, bookId, issuedDate, dueDate, rent} = req.body;

    try {
        const book = await Book_model.findById(bookId);
        if(!book){
            return res(404).json({error:"Book not found"});
        }
        if(book.book_quantity <= 0){
            return res.status(400).json({error: "Book is out of Stock"});
        }

        const assignment = await Assignment_model.create({
        userId, 
        bookId, 
        issuedDate: new Date(),
        dueDate, 
        rent
        });


        //this is the way of increasing or decreasing the book'quantity!
        await Book_model.findByIdAndUpdate(bookId, 
        {
            $inc: { book_quantity: -1 }
        }
        )

        res.status(201).json({ assignment });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const GetUserAssignments = async(req,res) => {
    const {userId} = req.params;

    try {
        const assignments = await Assignment_model.find(
            {userId}
        ).populate('bookId')
         .populate('userId', 'username','email')

         res.status(200).json({assignments})

//populate tells Mongoose:
//Instead of giving me only the ObjectId, go to the referenced collection and return the full document.

// this helps to get the full object which will help the UI developer to get the refference of all the object related things and not just the ID's
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
//for admin
export const GetAllAssignments = async( req ,res ) => {
    try {
        const assignments = await Assignment_model.find()
        .populated('bookId')
        .populated('userId', 'username','email')
        .sort({issuedDate: -1});

        res.status(200).json({assignments})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const ReturnBook = async (req, res) => {
    const { assignmentId } = req.params;

    try {
        const assignment = await Assignment_model.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found" });
        }

        if (assignment.returned) {
            return res.status(400).json({ error: "Book already returned" });
        }

        // Mark as returned
        assignment.returned = true;
        assignment.returnDate = new Date();
        await assignment.save();

        // Increase book quantity
        await Book_model.findByIdAndUpdate(assignment.bookId, {
            $inc: { book_quantity: 1 }
        });

        res.status(200).json({ assignment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};