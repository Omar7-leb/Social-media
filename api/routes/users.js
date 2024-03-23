import express from 'express';
import { getUser, updateUser, searchUser,getSuggester } from '../controllers/user.js';

const router = express.Router();

router.get('/find/:userId',getUser);
router.put('/', updateUser);
router.post('/searchUser', searchUser);
router.get('/getSuggester', getSuggester);
export default router;