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
   - Book categories/genres
   - ISBN tracking
   - Book images/cover photos
   - Book descriptions
   - Publication date
   - Publisher information
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
   - Membership tiers
   - Account verification

### 5. **Search & Filtering**
   - Advanced search with multiple filters
   - Full-text search
   - Search by ISBN, category, etc.
   - Sorting options (by date, popularity, etc.)
   - Pagination for large datasets

### 6. **Reporting & Analytics**
   - Dashboard with statistics
   - Most popular books
   - User borrowing patterns
   - Revenue reports
   - Overdue books report
   - Export data to CSV/PDF

### 7. **Notifications System**
   - Email notifications for:
     - Book due reminders
     - Overdue warnings
     - New book arrivals
     - Reservation availability
   - In-app notifications
   - SMS notifications (optional)

### 8. **Payment Integration**
   - Online payment for rent/fines
   - Payment gateway integration (Stripe, Razorpay, etc.)
   - Payment history
   - Receipt generation

### 9. **Data Validation & Error Handling**
   - Input validation on backend
   - Proper error messages
   - Rate limiting
   - Request validation middleware

### 10. **Security Enhancements**
   - CORS configuration
   - Input sanitization
   - SQL injection prevention (if using SQL)
   - XSS protection
   - CSRF tokens
   - API rate limiting

### 11. **Database Improvements**
   - Indexes for frequently queried fields
   - Database connection pooling
   - Backup and recovery strategy
   - Data archiving for old records

### 12. **API Improvements**
   - API versioning
   - API documentation (Swagger/OpenAPI)
   - Response pagination
   - Filtering and sorting in API
   - API caching for frequently accessed data

### 13. **Testing**
   - Unit tests
   - Integration tests
   - End-to-end tests
   - API testing

### 14. **Deployment & DevOps**
   - Environment variables for configuration
   - Docker containerization
   - CI/CD pipeline
   - Logging and monitoring
   - Error tracking (Sentry, etc.)

### 15. **Additional Features**
   - Book recommendations based on user history
   - Wishlist functionality
   - Book reviews and ratings
   - Social features (share books, reading lists)
   - Multi-language support
   - Dark mode
   - Mobile responsive design (already done with Tailwind)
   - Accessibility improvements (ARIA labels, keyboard navigation)

---

## Priority Implementation Order

1. **High Priority (Required for basic functionality)**
   - Assignment model and endpoints (listed above)
   - Authentication system
   - Input validation

2. **Medium Priority (Important for production)**
   - Fine calculation for overdue books
   - Email notifications
   - Search improvements
   - Error handling

3. **Low Priority (Nice to have)**
   - Advanced analytics
   - Payment integration
   - Social features
   - Recommendations

---

## Notes

- The frontend is already built and ready to work once the assignment endpoints are implemented
- All API calls in the frontend use the `fetch` API as requested
- React Router is set up for navigation
- React Hot Toast is integrated for notifications
- Tailwind CSS v4.1 is configured and used throughout

