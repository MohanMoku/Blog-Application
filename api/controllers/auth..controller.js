import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

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

export const signin = async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(errorHandler(400, 'All fields are required'))
    }

    try {
        const validUser = await User.findOne({ email })

        if (!validUser) {
            return next(errorHandler(400, 'User Not Found'))
        }

        // const hashedPassword = bcrypt.hashSync(password, 10); // not needed

        const validPassword = bcrypt.compareSync(password, validUser.password)

        if (!validPassword) {
            return next(errorHandler(400, 'Invalid Password'))
        }

        const token = jwt.sign(
            { id: validUser._id, },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        )

        const { password: pass, ...rest } = validUser._doc;

        res
            .cookie('access_token', token, {
                httpOnly: true,
                secure: false, // set to true in production
                sameSite: 'lax',
                path: '/',
                maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
            })
            .status(200)
            .json({
                message: 'Login Successful',
                user: rest,
            })

    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body
    try {
        const user = await User.findOne({ email })

        if (user) {
            const token = jwt.sign(
                { id: user._id, },
                process.env.JWT_SECRET,
                { expiresIn: '3d' }
            )
            const { password, ...rest } = user._doc

            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 3 * 24 * 60 * 60 * 1000
                })
                .status(200)
                .json({
                    message: 'Login Successful',
                    user: rest,
                })
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10)

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            })
            await newUser.save()
            const token = jwt.sign(
                { id: newUser._id, },
                process.env.JWT_SECRET,
                { expiresIn: '3d' }
            )
            const { password, ...rest } = newUser._doc

            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 3 * 24 * 60 * 60 * 1000
                })
                .status(200)
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
}