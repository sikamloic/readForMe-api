const {User} = require('../models')
const apiError = require('../utils/apiError')
const httpStatus = require('http-status')

const register = async(userBody) =>{
  // if( await User.isNumberTaken(userBody.telephone)){
  //   throw new apiError(httpStatus.BAD_REQUEST, ' Ce numéro de téléphone existe déjà !!!');
  // }
  // if( await User.isPseudoTaken(userBody.pseudo)){
  //   throw new apiError(httpStatus.BAD_REQUEST, 'Ce pseudo existe déjà !!!');
  // }
  // if( await User.isAyobaIdTaken(userBody.ayobaId)){
  //   throw new apiError(httpStatus.BAD_REQUEST, 'Cet identifiant AYOBA existe déjà !!!');
  // }
  if(await User.isNumberTaken(userBody.telephone) && await User.isPseudoTaken(userBody.pseudo) && await User.isAyobaIdTaken(userBody.ayobaId)){
    throw new apiError(httpStatus.BAD_REQUEST, 'Identifiant ou pseudo ou numéto de téléphone existant déjà !!!');
  }
  return User.create(userBody)
}

const getUserById = async(id) =>{
  const user = await User.findById(id)
  if(!user) throw new apiError(httpStatus.BAD_REQUEST, "Utilisateur inexistant !!!")
  return user
}

const getAllUsers = async(body) =>{
  return User.paginate(body.filter, body.options)
}

const getUserByEmail = async(email) =>{
  return User.findOne({email: email})
}

const updateUserById = async (id, updateBody) => {
  const user = await getUserById(id);
  if (!user) {
    throw new apiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email))) {
    throw new apiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (id) => {
  const user = await getUserById(id)
  return user.deleteOne(id)
};

const uploadImage = async(id, file) =>{
  const user = await getUserById(id)
  return user.updateOne({image: file}, {new: true})
}

const getUserByNumber = async(number) =>{
  return User.findOne({telephone: number})
}

module.exports = {
  register,
  getUserByEmail,
  getUserById,
  deleteUserById,
  updateUserById,
  getAllUsers,
  uploadImage,
  getUserByNumber
}