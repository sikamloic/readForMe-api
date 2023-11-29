const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, otpService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.register(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

// const login = catchAsync(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await authService.loginUserWithEmailAndPassword(email, password);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.send({ user, tokens });
// });

const login = catchAsync(async (req, res) => {
  const { telephone, password } = req.body;
  const user = await authService.loginUserWithNumberAndPassword(telephone, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordCodeOtp = await otpService.generateResetPasswordOtp(req.body.email);
  console.log(typeof resetPasswordCodeOtp)
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordCodeOtp);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.params.userId, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyCode = catchAsync(async(req, res) =>{
  const doc = await otpService.verifyCodeOtp(req.params.userId, req.body.code, 'resetPassword')
  res.send(doc)
})

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailCodeOtp = await otpService.generateVerifyEmailOtp(req.email);
  await emailService.sendVerificationEmail(req.email, verifyEmailCodeOtp);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.body.code);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  verifyCode
};