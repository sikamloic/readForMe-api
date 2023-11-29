const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    ayobaId: Joi.string().required(),
    pseudo: Joi.string().required(),
    telephone: Joi.number().required(),
    password: Joi.string().required()
  }),
};

module.exports = {
    register
}