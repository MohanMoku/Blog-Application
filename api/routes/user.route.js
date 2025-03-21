import express from 'express'
import { test, updateUser, deleteUser, signout, getusers, getuser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// router.get('/test', (req, res) => {
//     console.log(req.cookies);
//     res.send(req.cookies)
// })

router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout',signout)
router.get('/getusers', verifyToken, getusers);
router.get('/:userId', getuser);

export default router;