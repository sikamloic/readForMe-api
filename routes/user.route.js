const express = require('express')
const {userController} = require('../controllers')

const router = express.Router()

router.post('/register', userController.register)
router.route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser)
router.post('/email', userController.getUserByEmail)
router.post('/', userController.getUsers)
router.put('/:id/uploadImage', userController.uploadImage)
module.exports = router