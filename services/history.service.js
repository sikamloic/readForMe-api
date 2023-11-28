const {History} = require('../models')
const httpStatus = require('http-status')
const apiError = require('../utils/apiError')

const add = async(userId, body) =>{
    let history
    if(body.public){
        history = await History.create({
            userId: userId,
            text: body.text,
            public: body.public
        })
    }
    else{
        history = await History.create({
            userId: userId,
            text: body.text,
            public: body.public
        })
    }
    return history
}

const deleteOne = async(id) =>{
    const history = await getOne(id)
    return history.deleteOne({id})
}

const getOne = async(id) =>{
    const history = await History.findById(id)
    if(!history) throw new apiError(httpStatus.BAD_REQUEST, "texte introuvable !!!")
    return history
}

const getAllByUserId = async(query) =>{
    let filter = JSON.parse(query.filter)
    let options = JSON.parse(query.options)
    return History.paginate(filter, options)
}

const visibility = async(id, body) =>{
    const history = await getOne(id)
    return history.updateOne({public: body.public})
}


module.exports = {
    add,
    deleteOne,
    getAllByUserId,
    getOne,
    visibility
}