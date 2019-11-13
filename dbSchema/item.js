const mongoose = require('mongoose')

const uuidv4 = require('uuid/v4')

const Schema = mongoose.Schema

const ItemSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    title: {
        type: String,
        maxlength: 255,
        required: true
    },
    point_of_items: {
        type: Schema.Types.Decimal128,
        min: 1,
        required: true,
        get: (n) => {
            return parseFloat(n)
        }
    },
    uid: {
        type: String,
        ref: 'Users'
    },
    location: {
        type: String
    },
    qty: {
        type: Number,
        min: 1,
        required: true
    },
    img: { // TODO-N: move it into new Schema
        type: Array
    },
    comments: { // TODO-N: move it into new Schema
        type: Array
    },
    // TODO-N: set the cate in enum for item
    // TODO-N: set the cate im enum when promotion item
    is_show_by_user: {
        type: Boolean,
        default: true
    },
    is_alive_by_admin: {
        type: Boolean,
        default: true
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

module.exports = ItemSchema
