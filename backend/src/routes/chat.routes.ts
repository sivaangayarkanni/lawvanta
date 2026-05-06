import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import * as chatController from '../controllers/chat.controller';

const router = Router();

const auth = (req: Request, res: Response, next: NextFunction) => authenticate(req as AuthRequest, res, next);

router.use(auth);

router.get('/conversations', asyncHandler(chatController.getConversations));
router.post('/conversations', asyncHandler(chatController.createConversation));
router.get('/conversations/:id', asyncHandler(chatController.getConversation));
router.post('/conversations/:id/messages', asyncHandler(chatController.sendMessage));
router.delete('/conversations/:id', asyncHandler(chatController.deleteConversation));

export default router;
