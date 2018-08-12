const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const Complaints = new Schema({
    status: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title:{
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    comments: [{
        commentedBy: {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        },
        comment: {
            type: String,
            default: null
        }
    }]
});

module.exports = mongoose.model('Complaints', Complaints)