import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/logout', (req: Request, res: Response, next: NextFunction) => authenticate(req as AuthRequest, res, next), asyncHandler(authController.logout));
router.post('/refresh', asyncHandler(authController.refreshToken));
router.get('/me', (req: Request, res: Response, next: NextFunction) => authenticate(req as AuthRequest, res, next), asyncHandler(authController.getCurrentUser));

export default router;
