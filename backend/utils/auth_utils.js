import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'change_this_secret';
const JWT_EXPIRES_IN = '1h';


export const hashPassword = async(plainPassword) => {
    const hash = await bcrypt.hash(plainPassword, 10);
    //Here 10 is the salt number and it is the type of the hashin that represents 2^10 the larger is the number the more is the security and less is the speed.
    return hash
}

export const comparePassword = async(plainPassword, hashPassword) => {
    return bcrypt.compare(plainPassword, hashPassword);
}

export const generateToken = ({ id, role }) => {
  return jwt.sign(
    {
      userId: id,
      role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};