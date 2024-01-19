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
    // required: true
  },
  telephone: {
    type: String,
    required: true,
    validate: {
      validator: function(telephone){
        return telephone.length == 9
      },
      message: "Mauvais format de numéro de telephone"
    }
  },
  isNumberVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    validate: {
      validator: function(password) {
        return password.length >= 6 && password.length <= 20;
      },
      message: 'Le mot de passe doit avoir entre 6 et 20 caractères.'
    }
  }
});

userSchema.statics.isNumberTaken = async function (telephone, excludeUserId) {
  const user = await this.findOne({ telephone, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isPseudoTaken = async function (pseudo, excludeUserId) {
  const user = await this.findOne({ pseudo, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isAyobaIdTaken = async function (ayobaId, excludeUserId) {
  const user = await this.findOne({ ayobaId, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  const result = await bcrypt.compare(password, user.password);
  console.log(result)
  return result
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('ayobaId')) {
    const salt = await bcrypt.genSalt(10);
    user.ayobaId = await bcrypt.hash(user.ayobaId, salt);
  }
  next();
});

userSchema.plugin(toJSON)
paginate(userSchema)

const User = mongoose.model('User', userSchema);

module.exports = User