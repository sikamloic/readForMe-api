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

const getAllByUserId = catchAsync(async(req, res) =>{
    const result = await historyService.getAllByUserId(req.query)
    res.send(result)
})

const visibility = catchAsync(async(req, res) =>{
    const result = await historyService.visibility(req.params.id, req.body)
    res.send(result)
})

module.exports = {
    add,
    deleteOne,
    getAllByUserId,
    getOne,
    visibility
}