const express = require('express')
const {textToSpeechController} = require('../controllers')

const router = express.Router()

router.post('/text', textToSpeechController.convertTextToSpeech)
module.exports = router