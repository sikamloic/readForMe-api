const catchAsync = require('../utils/catchAsync');
const { historyService } = require('../services');

const add = catchAsync(async(req, res) =>{
    const result = await historyService.add(req.user, req.body)
    res.send(result)
})

const deleteOne = catchAsync(async(req, res) =>{
    const result = await historyService.deleteOne(req.params.id)
    res.send(result)
})

const getOne = catchAsync(async(req, res) =>{
    const result = await historyService.getOne(req.params.id)
    res.send(result)
})

const getAll = catchAsync(async(req, res) =>{
    const result = await historyService.getAll()
    res.send(result)
})

module.exports = {
    add,
    deleteOne,
    getAll,
    getOne
}