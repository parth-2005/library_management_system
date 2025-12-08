import User_model from '../modules/user.js';
import { comparePassword, generateToken } from '../utils/auth_utils.js';

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User_model.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.createdByAdmin) {
      return res.status(403).json({ message: 'Account not approved by admin' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, role: 'user' });

    return res.json({
      message: 'user logged in',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
      },
    });
  } catch (err) {
    console.error('user login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};