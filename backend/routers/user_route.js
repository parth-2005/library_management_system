import express from 'express';
import{
    AddUser,
    GetUserById,
    GetUsers,
    UpdateUserById,
    DeleteUserById,
    DeleteUsers
} from '../controllers/user_controller.js'
import { authRequired, requireAdmin } from '../middleware/auth_middleware.js';

const router = express.Router();

router.use(authRequired, requireAdmin);

router.post('/adduser', AddUser);
router.get('/getuser/:id', GetUserById);
router.get('/getuser', GetUsers);
router.put('/updateuser/:id', UpdateUserById);
router.delete('/deleteuser/:id', DeleteUserById);
router.delete('/delete', DeleteUsers);

export default router;