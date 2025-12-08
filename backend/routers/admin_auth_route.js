import express from 'express';
import { adminSignUp, adminSignIn } from '../controllers/admin_auth_controller.js';

const router = express.Router();

// /api/admin/signup
router.post('/admin/signup', adminSignUp);

// /api/admin/login
router.post('/admin/login', adminSignIn);

export default router;