import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            console.log('No token found in cookies:', req.cookies);
            return next(errorHandler(401, 'No authentication token, access denied'));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log('Token verification failed:', err);
                return next(errorHandler(403, 'Token is not valid'));
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.log('Error in verifyToken:', error);
        return next(errorHandler(500, 'Error verifying token'));
    }
}