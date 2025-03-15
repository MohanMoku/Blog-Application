import express from 'express'
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies)
})

router.put('/update/:userId', verifyToken, updateUser)

export default router;