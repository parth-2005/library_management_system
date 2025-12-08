import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'change_this_secret';

export const authRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  if (typeof authHeader !== 'string') {
    return res.status(401).json({ message: 'No token provided' });
  }

  const headerValue = authHeader.trim();
  if (!headerValue.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = headerValue.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can access this route' });
  }
  next();
}