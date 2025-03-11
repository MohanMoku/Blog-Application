import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then( () => {
    console.log('Connected to MongoDB')
})
.catch((err) => {
    console.log('Error connecting to MongoDB', err)
})

const app = express();
app.use(express.json())

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})