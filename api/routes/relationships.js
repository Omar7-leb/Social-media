import express from 'express';
import { getRelationships, addLRelationship , deleteRelationship } from '../controllers/relationship.js';

const router = express.Router();

router.get('/', getRelationships);
router.post('/', addLRelationship);
router.delete('/', deleteRelationship);

export default router;