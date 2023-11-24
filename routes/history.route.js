const express = require('express')
const {historyController} = require('../controllers')

const router = express.Router()

router.post('/add', historyController.add)
route.get('/', historyController.getAll)
router.route('/:id')
    .get(historyController.getOne)
    .delete(historyController.deleteOne)
module.exports = router