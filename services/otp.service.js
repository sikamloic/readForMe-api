const moment = require('moment')
const userService = require('./user.service')
const apiError = require('../utils/apiError')
const httpStatus = require('http-status')
const {Otp} = require('../models')
const config = require('../config/config');
const { otpType } = require('../config/tokens');

const generateOtp =() =>{
  const code = Math.floor(Math.random() * 10000)
  console.log(typeof code)
  return code.toString()
}

const saveOtp = async(userId, code, expire, type) =>{
  console.log(typeof code)
  const otpDoc = await Otp.create({
    user: userId,
    code: code,
    expire: expire,
    type: type
  })
  return otpDoc
}

const verifyCodeOtp = async(userId, code, type) =>{
  const otp = await getCodeByUserId(userId)
  console.log(typeof code)
  if(!(await otp.isCodeMatch(code))){
    throw new apiError(httpStatus.UNAUTHORIZED, 'Incorrect code OTP');
  }
  const doc = await Otp.findOne({type: type, expire: { $gt: new Date() }})
  if (!doc) {
    throw new Error('Token not found');
  }
  return doc
}

const getCodeByUserId = async(userId) =>{
  return Otp.findOne({user: userId})
}

const generateResetPasswordOtp = async(email) =>{
  const user = await userService.getUserByEmail(email)
  if(!user){
    throw new apiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const code = generateOtp()
  const expiration = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  await saveOtp(user._id, code, expiration, otpType.RESET_PASSWORD)
  return code
}

const generateVerifyEmailOtp = async(email) =>{
  const user = await userService.getUserByEmail(email)
  if(!user){
    throw new apiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const code = generateOtp()
  const expiration = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  await saveOtp(user._id, code, expiration, otpType.VERIFY_EMAIL)
  return code
}

setInterval(async () => {
  const expiredOTPs = await Otp.find({ expire: { $lte: new Date() } });
  if (expiredOTPs.length > 0) {
    await Otp.deleteMany({ _id: { $in: expiredOTPs.map(otp => otp._id) } });
    console.log(`Deleted ${expiredOTPs.length} expired OTPs`);
  }
}, 60000)

module.exports = {
  generateOtp,
  saveOtp,
  generateResetPasswordOtp,
  verifyCodeOtp,
  generateVerifyEmailOtp,
  getCodeByUserId
}