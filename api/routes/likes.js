import express from 'express';
import { getLikes, addLike , deleteLike, getLikesActivity } from '../controllers/like.js';

const router = express.Router();

router.get('/', getLikes);
router.post('/', addLike);
router.delete('/', deleteLike);
router.get('/LikesActivity', getLikesActivity);

export default router;