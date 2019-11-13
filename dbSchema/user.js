const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    username: {
        type: String,
        lowercase: true,
        minlength: 4,
        maxlength: 20,
        index: true,
        unique: true,
        required: true
    },
    pwd: {
        type: String,
        minlength: 8,
        maxlength: 12,
        required: true
    },
    pp_url: {
        type: String,
        maxlength: 100
    },
    following_list: {
        type: Array
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = UserSchema
