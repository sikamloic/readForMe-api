const mongoose = require('mongoose')
const {toJSON, paginate, } = require('./plugins')

const historySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    titre: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    public:{
        type: Boolean,
        default: false
    }
})

historySchema.plugin(toJSON)
paginate(historySchema)

const History = mongoose.model('History', historySchema);

module.exports = History