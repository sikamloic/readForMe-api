const express = require('express');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');
const {tokenService, authService}= require('../services')
const auth = require('../middlewares/auth');
const passport = require('passport')

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // L'utilisateur est connecté avec succès, vous pouvez rediriger ou effectuer d'autres opérations
    res.send('ok Facebook');
  }
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      console.log('1 =' + typeof req.user.email)
      console.log(req.pwd)
      const user = await authService.loginUserWithEmailAndPassword(req.user.email, req.pwd)
      console.log('2 =' + user)
      const token = await tokenService.generateAuthTokens(user)
      console.log(token)
      res.send({ user, token });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.loginUserWithNumberAndPassword), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/verify-code/:userId', validate(authValidation.verifyCode), authController.verifyCode)
router.post('/reset-password/:userId', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;