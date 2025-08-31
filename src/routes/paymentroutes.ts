import { Router } from 'express';
import { createSession, updatePaymentStatus, confirmPayment  } from '../controllers/paymentcontroller';
import { authenticateUser } from '../middelwares/authmiddelware';

const router = Router();

// Stripe checkout session
router.post('/create-session', authenticateUser, createSession);

// Payment status update (manual testing)
router.put('/:id', updatePaymentStatus);

router.post("/confirm-payment", authenticateUser, confirmPayment);
export default router;
