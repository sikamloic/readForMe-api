const catchAsync = require('../utils/catchAsync')
const {textToSpeechService} = require('../services')

const convertTextToSpeech = catchAsync(async(req, res) =>{
    const result = await textToSpeechService.convertToAudio(req.body.text)
    res.send(result)
})

module.exports = {
    convertTextToSpeech
}