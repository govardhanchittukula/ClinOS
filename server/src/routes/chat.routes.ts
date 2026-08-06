import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';

const router = Router();

// Chat & Clinical AI Companion routes
router.post('/message', (req, res, next) => chatController.handleChatMessage(req, res, next));
router.get('/prompts', (req, res, next) => chatController.getSuggestedPrompts(req, res, next));

export default router;
