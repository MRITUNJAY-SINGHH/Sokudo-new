import express from 'express';
import passport from '../config/passport.js';
import {
   registerCustomer,
   loginCustomer,
   resetPasswordWithOtpCustomer,
   verifyOtpCustomer,
   sendOtpCustomer,
   getAllCustomers,
   generateToken,
   deleteCustomer,
} from '../controllers/customerController.js';

const router = express.Router();

// Public Routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/send-otp', sendOtpCustomer);
router.post('/verify-otp', verifyOtpCustomer);
router.put('/reset-password-otp', resetPasswordWithOtpCustomer);
// Google OAuth routes
router.get(
   '/auth/google',
   passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
   '/me',
   passport.authenticate('jwt', { session: false }),
   (req, res) => {
      res.json(req.user);
   }
);

router.get(
   '/auth/google/callback',
   passport.authenticate('google', {
      session: false,
      failureRedirect: `${process.env.FRONTEND_URL}/login`,
   }),
   (req, res) => {
      const token = generateToken(req.user._id);
      const redirectURL = `${process.env.FRONTEND_URL}/auth/success?token=${token}&name=${req.user.name}&email=${req.user.email}&avatar=${req.user.avatar}`;

      res.redirect(redirectURL);
   }
);

router.get('/', getAllCustomers);
router.delete('/:id', deleteCustomer);

export default router;
