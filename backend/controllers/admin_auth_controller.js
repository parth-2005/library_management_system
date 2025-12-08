import Admin_model from '../modules/admin.js';
import { hashPassword, comparePassword,generateToken } from '../utils/auth_utils.js';

export const adminSignUp = async(req,res) => {
    try{
        const {adminName,email,phone_number,password} = req.body;
        const emailTaken = await Admin_model.findOne({ email });
        const phoneNumberTaken = await Admin_model.findOne({phone_number})
    if (emailTaken) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }
    if (phoneNumberTaken) {
      return res.status(400).json({ message: 'Admin with this phoneNumber already exists' });
    }
    const passwordHash = await hashPassword(password);
    const admin = await Admin_model.create({
        adminName,
        email,
        phone_number,
        password: passwordHash,
        role: 'admin'
    })

    const token = generateToken({id: admin._id, role:'admin'});

    return res.status(201).json({message:"Admin created successfully!", 
        token,
        admin: {
            id: admin._id,
            adminName: admin.adminName,
            email: admin.email,
            role: admin.role,
      },})
}
    catch(error){
        console.log('Error in creating the Admin')
        return res.status(500).json({message:'Server error'});
    }
};


export const adminSignIn = async(req,res) => {
    try {
    const { email, password } = req.body;

    const admin = await Admin_model.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: admin._id, role: 'admin' });

    return res.json({
      message: 'Admin logged in',
      token,
      admin: {
        id: admin._id,
        adminName: admin.adminName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};