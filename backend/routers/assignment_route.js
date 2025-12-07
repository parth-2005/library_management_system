import express from 'express';
import {
    AssignBook,
    GetUserAssignments,
    GetAllAssignments,
    ReturnBook,
} from '../controllers/assignment_controller.js'

const router = express.Router();

router.post('/assign', AssignBook);
router.get('/user/:userId', GetUserAssignments);
router.get('/all', GetAllAssignments);
router.post('/return/:assignmentId', ReturnBook);

export default router;

