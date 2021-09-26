const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema
const UserSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "/images/profilePic.jpeg" },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    likes:[{type:Schema.Types.ObjectId,ref:'Post'}],
    retweets:[{type:Schema.Types.ObjectId,ref:'Post'}],
    following:[{type:Schema.Types.ObjectId,ref:'User'}],
    followers:[{type:Schema.Types.ObjectId,ref:'User'}]
}, { timestamps: true })

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

UserSchema.statics.deleteToken = async (username, token) =>{
    const user = await User.findOne({username})
    if(!user){
        throw new Error("No such user")
    }
    
    //remove tokens from DB
    user.tokens = user.tokens.filter(function(value, index){
        return value['token'] != token
    })
    await user.save()
}

UserSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })
    if (!user) {
        throw new Error("Invalid credentials")
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Invalid credentials")
    }
    return user
}

var User = mongoose.model('User', UserSchema)
module.exports = User