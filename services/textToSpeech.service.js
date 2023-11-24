const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
// Configurez votre clé d'API et d'autres paramètres
// const client = new textToSpeech.TextToSpeechClient({
//     keyFilename: 'audio.json'
//   });
  
//   const synthesizeSpeech = util.promisify(client.synthesizeSpeech.bind(client));
  
//   async function convertToAudio(text) {
//     const request = {
//       input: { text },
//       voice: { languageCode: 'fr-FR', name: 'fr-FR-Wavenet-C', ssmlGender: 'NEUTRAL' },
//       audioConfig: { audioEncoding: 'LINEAR16' }
//     };
  
//     try {
//       const [response] = await synthesizeSpeech(request);
//       const writeFile = util.promisify(fs.writeFile);
//       await writeFile('output.wav', response.audioContent, 'binary');
//       return response.audioContent;
//     } catch (error) {
//       console.error('Error converting text to speech:', error);
//       throw error;
//     }
//   }
const client = new textToSpeech.TextToSpeechClient();
async function convertToAudio(text) {
  // The text to synthesize
  // const text = 'hello, world!';

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}
  
  module.exports = { convertToAudio };