import express from 'express';
import { getRelationships, addLRelationship , deleteRelationship , getMyFriends } from '../controllers/relationship.js';

const router = express.Router();

router.get('/', getRelationships);
router.post('/', addLRelationship);
router.delete('/', deleteRelationship);
router.get('/friends/:userId', getMyFriends);

export default router;