import express from 'express';
import {
    AssignBook,
    GetUserAssignments,
    GetAllAssignments,
    ReturnBook,
} from '../controllers/assignment_controller.js'
import {sendReminderEmail} from '../controllers/email_controller.js';
import { authRequired, requireAdmin } from '../middleware/auth_middleware.js';

const router = express.Router();

// All assignment routes require authentication
router.use(authRequired);

// Admin only routes
router.post('/assign', requireAdmin, AssignBook);
router.get('/all', requireAdmin, GetAllAssignments);
router.post('/return/:assignmentId', requireAdmin, ReturnBook);
router.post('/send-reminder/:assignmentId', requireAdmin, sendReminderEmail);

// User can view their own assignments (admin can view any)
router.get('/user/:userId', (req, res, next) => {
  const { user } = req;
  const { userId } = req.params;
  const requesterId = user?.userId ? String(user.userId) : null;

  if (user?.role === 'admin' || requesterId === String(userId)) {
    return GetUserAssignments(req, res, next);
  }

  return res.status(403).json({ message: 'Not allowed to view assignments' });
});

export default router;

