import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err)
    })

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // change this to your frontend URL when deploying to production
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    exposedHeaders: ['set-cookie'],
}));

// app.use((req, res, next) => {
//     console.log('Request URL:', req.url);
//     console.log('Cookies received:', req.cookies);
//     console.log('Headers:', req.headers);
//     next();
// });

app.use(express.json())
app.use(cookieParser())

app.use('/user', userRoute)
app.use('/auth', authRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})