# Backend Changes Required for Library Management System

## Required Backend Endpoints

The frontend is built and ready, but the following backend endpoints need to be implemented for full functionality:

### 1. Book Assignment Model

Create a new model for tracking book assignments:

**File: `backend/modules/assignment.js`**
```javascript
import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    issuedDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    daysAllowed: {
        type: Number,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    returned: {
        type: Boolean,
        default: false
    },
    returnDate: {
        type: Date
    }
});

const Assignment_model = mongoose.model("Assignment", assignmentSchema);
export default Assignment_model;
```

### 2. Assignment Controller

**File: `backend/controllers/assignment_controller.js`**
```javascript
import Assignment_model from '../modules/assignment.js';
import Book_model from '../modules/book.js';
import mongoose from 'mongoose';

// Assign a book to a user
export const AssignBook = async (req, res) => {
    const { bookId, userId, daysAllowed, rent } = req.body;

    try {
        // Check if book exists and has available quantity
        const book = await Book_model.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        if (book.book_quantity <= 0) {
            return res.status(400).json({ error: "Book is out of stock" });
        }

        // Create assignment
        const assignment = await Assignment_model.create({
            userId,
            bookId,
            daysAllowed,
            rent,
            issuedDate: new Date()
        });

        // Decrease book quantity
        await Book_model.findByIdAndUpdate(bookId, {
            $inc: { book_quantity: -1 }
        });

        res.status(201).json({ assignment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all assignments for a specific user
export const GetUserAssignments = async (req, res) => {
    const { userId } = req.params;

    try {
        const assignments = await Assignment_model.find({ userId })
            .populate('bookId')
            .populate('userId', 'username email');
        
        res.status(200).json({ assignments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all assignments (for admin)
export const GetAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment_model.find()
            .populate('bookId')
            .populate('userId', 'username email')
            .sort({ issuedDate: -1 });
        
        res.status(200).json({ assignments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark a book as returned
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
```

### 3. Assignment Routes

**File: `backend/routers/assignment_route.js`**
```javascript
import express from 'express';
import {
    AssignBook,
    GetUserAssignments,
    GetAllAssignments,
    ReturnBook
} from '../controllers/assignment_controller.js';

const router = express.Router();

router.post('/assign', AssignBook);
router.get('/user/:userId', GetUserAssignments);
router.get('/all', GetAllAssignments);
router.post('/return/:assignmentId', ReturnBook);

export default router;
```

### 4. Update main.js

Add the assignment route to `backend/main.js`:

```javascript
import assignment_route from "./routers/assignment_route.js"

// ... existing code ...

app.use("/api/assignment", assignment_route);
```

---

## Suggested Production-Ready Features

### 1. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Role-based access control (Admin vs User)
   - Password hashing (bcrypt)
   - Session management
   - Protected routes

### 2. **Enhanced Book Management**
   - Book images/cover photos
   - Book descriptions
   - Book ratings and reviews

### 3. **Advanced Assignment Features**
   - Automatic fine calculation for overdue books
   - Email/SMS notifications for due dates
   - Renewal functionality (extend due date)
   - Reservation system (queue for popular books)
   - Maximum books per user limit
   - Assignment history tracking

### 4. **User Management**
   - User profiles with avatars
   - User activity history
   - User ratings/reputation
   - Account verification

### 5. **Search & Filtering**
   - Full-text search

### 6. **Reporting & Analytics**

### 7. **Notifications System**
     - Email notifications for:
     - Book due reminders
     - Overdue warnings
     - New book arrivals
     - Reservation availability
     - SMS notifications (optional)

### 8. **Payment Integration**
   - Online payment for rent/fines
   - Payment gateway integration (Stripe, Razorpay, etc.)
   - Payment history
   - Receipt generation

## Notes

- The frontend is already built and ready to work once the assignment endpoints are implemented
- All API calls in the frontend use the `fetch` API as requested
- React Router is set up for navigation
- React Hot Toast is integrated for notifications
- Tailwind CSS v4.1 is configured and used throughout

