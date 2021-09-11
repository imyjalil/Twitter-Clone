const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema
const PostSchema = new Schema({
    content:{ type: String, trim: true },
    postedBy:{type:Schema.Types.ObjectId,ref:'User'},
    pinned:Boolean
}, { timestamps: true })

var Post = mongoose.model('Post', PostSchema)
module.exports = Post