import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const auth = (req: Request, res: Response, next: NextFunction) => authenticate(req as AuthRequest, res, next);
router.use(auth);

router.get('/templates', asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
}));

router.post('/generate', asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: { message: 'Order generated' } });
}));

export default router;
