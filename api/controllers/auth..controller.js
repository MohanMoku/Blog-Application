import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    const user = req.body;

    if (!user.username || !user.email || !user.password) {
        next(errorHandler(400, 'All fields are required'))
    }

    const hashedPassword = bcrypt.hashSync(user.password, 10);

    const newUser = new User({
        username: user.username,
        email: user.email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        next(error)
    }
}