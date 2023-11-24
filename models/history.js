const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
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

const History = mongoose.model('History', historySchema);

module.exports = History