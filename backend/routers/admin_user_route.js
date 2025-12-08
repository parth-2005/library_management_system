import express from 'express';
import { createUserByAdmin, getAllUsers } from '../controllers/admin_user_controller.js';
import { authRequired, requireAdmin } from '../middleware/auth_middleware.js';

const router = express.Router();

// All routes here require admin auth
router.use(authRequired, requireAdmin);

// /api/admin/users  (POST: create user)
router.post('/admin/users', createUserByAdmin);

// /api/admin/users  (GET: list all)
router.get('/admin/users', getAllUsers);

export default router;