const express = require('express')
const {historyController} = require('../controllers')
const auth = require('../middlewares/auth')

const router = express.Router()

router.post('/add', auth(), historyController.add)
router.get('/', auth(), historyController.getAllByUserId)
router.route('/:id')
    .get(auth(), historyController.getOne)
    .delete(auth(), historyController.deleteOne)
router.patch('/visibility/:id', auth(), historyController.visibility)
module.exports = router