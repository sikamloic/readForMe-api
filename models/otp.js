const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { otpType } = require('../config/tokens');

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true,
  },
  expire: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: [otpType.RESET_PASSWORD, otpType.VERIFY_EMAIL],
    required: true
  }
})

otpSchema.methods.isCodeMatch = async function (code) {
  const codeOtp = this;
  const result = await bcrypt.compare(code, codeOtp.code);
  console.log(result)
  return result
};

otpSchema.pre('save', async function (next) {
  const codeOtp = this;
  if (codeOtp.isModified('code')) {
    const salt = await bcrypt.genSalt(10);
    console.log(typeof codeOtp.code)
    codeOtp.code = await bcrypt.hash(codeOtp.code, salt);
  }
  next();
});

const Otp = mongoose.model('otp', otpSchema)
module.exports = Otp