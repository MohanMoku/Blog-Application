import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import commentRoute from './routes/comment.route.js';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err)
    })

    const __dirname = path.resolve();
const app = express();
// console.log(process.env.CLIENT_URL);

app.use(cors({
    origin: process.env.CLIENT_URL, // change this to your frontend URL when deploying to production, '*' for local testing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    exposedHeaders: ['set-cookie'],
}));

// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         statusCode: 404,
//         message: 'API endpoint not found'
//     });
// });

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
app.use('/post', postRoute)
app.use('/comment', commentRoute)

app.use(express.static(path.join(__dirname, '/client-side/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client-side/build/index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
    console.log(`The process id is ${process.pid}`)
})
