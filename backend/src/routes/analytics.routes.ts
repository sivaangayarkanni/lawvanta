import { Router, Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const auth = (req: Request, res: Response, next: NextFunction) => authenticate(req as AuthRequest, res, next);
router.use(auth);

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: { metrics: {} } });
}));

export default router;
