import { Router } from 'express';
import { createSession } from '../controllers/paymentcontroller';
import { authenticateUser  } from '../middelwares/authmiddelware';

const router = Router();

router.post('/create-session', authenticateUser , createSession);

export default router;