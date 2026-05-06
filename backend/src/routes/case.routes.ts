import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import * as caseController from '../controllers/case.controller';

const router = Router();
router.use(authenticate);

router.get('/',     asyncHandler(caseController.getCases));
router.post('/',    asyncHandler(caseController.createCase));
router.get('/:id',  asyncHandler(caseController.getCaseById));
router.put('/:id',  asyncHandler(caseController.updateCase));
router.delete('/:id', asyncHandler(caseController.deleteCase));

export default router;
