import Assignment_model from '../modules/assignment.js';
import { sendReturnReminderEmail } from '../utils/emailService.js';


export const sendReminderEmail = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    // Find the assignment and populate user and book details
    const assignment = await Assignment_model.findById(assignmentId)
    // .populate give the following fields of the object rather than just the objectId.
      .populate('userId', 'username email')
      .populate('bookId', 'book_title');

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (assignment.returned) {
      return res.status(400).json({ error: 'Book has already been returned' });
    }

    if (!assignment.userId || !assignment.userId.email) {
      return res.status(400).json({ error: 'User email not found' });
    }

    // Calculate days remaining
    const today = new Date();
    const dueDate = new Date(assignment.dueDate);
    const diffTime = dueDate - today;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); //math.ceil is used to round of the decimal number to the nearest integer.

    // Format due date for email
    const formattedDueDate = dueDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Send email - using object format as expected by emailService
    await sendReturnReminderEmail({
      to: assignment.userId.email, //this will give the assignment's id generated in mongodb which will have the userId and the bookId as a ref and thus we are getting the email id in such a way!
      name: assignment.userId.username, 
      bookTitle: assignment.bookId.book_title,
      dueDate: formattedDueDate,
    });

    res.status(200).json({
      message: 'Reminder email sent successfully',
      assignment: {
        // id: assignment._id,
        user: assignment.userId.username,
        email: assignment.userId.email,
        book: assignment.bookId.book_title,
        daysRemaining,
      },
    });
  } catch (error) {
    console.error('Error sending reminder email:', error);
    res.status(500).json({ message: error.message });
  }
};


