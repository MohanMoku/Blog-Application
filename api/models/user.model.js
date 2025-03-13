import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default:'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User;