const {userService} = require('../services')
const catchAsync = require('../utils/catchAsync')

const register = catchAsync(async(req, res) =>{
  const user = await userService.register(req.body)
  res.send(user)
})

const getUser = catchAsync(async(req, res) =>{
  const user = await userService.getUserById(req.params.id)
  res.send(user)
})

const getUserByEmail = catchAsync(async(req, res) =>{
  const user = await userService.getUserByEmail(req.body.email)
  res.send(user)
})

const deleteUser = catchAsync(async(req, res) =>{
  const user = await userService.deleteUserById(req.params.id)
  res.send(user)
})

const updateUser = catchAsync(async(req, res) =>{
  const user = await userService.updateUserById(req.params.id, req.body)
  res.send(user)
})

const getUsers = catchAsync(async(req, res) =>{
  const user = await userService.getAllUsers(req.body)
  res.send(user)
})

const uploadImage = catchAsync(async(req, res) =>{
  const results = userService.uploadImage(req.params.id, req.body)
  res.send(results)
})

module.exports = {
  register,
  getUser,
  deleteUser,
  updateUser,
  getUserByEmail,
  getUsers,
  uploadImage
}