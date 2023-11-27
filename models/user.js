const mongoose =  require('mongoose')
const joi = require('joi')
const bcrypt = require('bcryptjs')
const {toJSON, paginate, } = require('./plugins')

const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true
  },
  ayobaId: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true,
  },
  isNumberVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.statics.isNumberTaken = async function (telephone, excludeUserId) {
  const user = await this.findOne({ telephone, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.plugin(toJSON)
paginate(userSchema)

const User = mongoose.model('User', userSchema);

module.exports = User