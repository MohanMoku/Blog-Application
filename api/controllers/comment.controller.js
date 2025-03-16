import Comment from '../models/comment.model.js';
import { errorHandler } from '../utils/error.js';

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        if (userId !== req.user.id) {
            return next(errorHandler(401, 'You are not allowed to comment on this post'))
        }

        const newComment = new Comment({
            content,
            userId,
            postId
        })

        const savedComment = await newComment.save()

        res.status(201).json(savedComment)

    } catch (error) {
        next(errorHandler(400, error.message))
    }
}