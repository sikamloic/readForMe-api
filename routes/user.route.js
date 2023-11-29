const express = require('express')
const {userController} = require('../controllers')
const {userValidation} = require('../validations')
const validate = require('../middlewares/validate')

const router = express.Router()

router.post('/register', validate(userValidation.register), userController.register)
router.route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser)
router.post('/email', userController.getUserByEmail)
router.post('/', userController.getUsers)
router.put('/:id/uploadImage', userController.uploadImage)
module.exports = router