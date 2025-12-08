import User_model from '../modules/user.js';
import { hashPassword } from '../utils/auth_utils.js';

export const createUserByAdmin = async (req, res) => {
  try {
    const { username, email, phone_number, password } = req.body;

    const existingUser = await User_model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const passwordHash = await hashPassword(password);

    const user = await User_model.create({
      username,
      email,
      phone_number,
      password: passwordHash,
      createdByAdmin: true,
      isActive: true,
    });

    return res.status(201).json({
      message: 'User created by admin',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error('Create user by admin error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User_model.find().select('-password');
    return res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};