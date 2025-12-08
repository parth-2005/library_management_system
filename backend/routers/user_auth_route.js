import express from 'express';
import { userLogin } from '../controllers/user_auth_controller.js';

const router = express.Router();

// /api/user/login
router.post('/user/login', userLogin);

export default router;