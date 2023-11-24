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
    return history.deleteOne(id)
}

const getOne = async(id) =>{
    const history = await History.findById(id)
    if(!history) throw new apiError(httpStatus.BAD_REQUEST, "texte introuvable !!!")
    return history
}

const getAll = async(id) =>{
    return History.find()
}

module.exports = {
    add,
    deleteOne,
    getAll,
    getOne
}