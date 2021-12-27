const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./tasks')
const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
            validate(val){
                if(!validator.isEmail(val))
                    throw new Error("Please enter the valid email address")
            }
        },
        password : {
            type : String,
            required : true,
            trim : true,
            validate(val){
                if(val.length < 8)
                    throw new Error("Password must contains 6 characters")
                if(val.toLowerCase().includes('password'))
                    throw new Error('Password shouldn\'t have a "password"')
            }
        },
        age : {
            type : Number,
            validate(val){
                if(val < 0)
                    throw new Error("Age must be a positive Number")
            }
        },
        tokens : [{
            token : {
                type : String,
                required : true
            }
        }],
        avatar : {
            type : Buffer
        }
    },{
        timestamps : true
    })

userSchema.virtual('tasks', {
    ref : 'Tasks',
    localField : "_id",
    foreignField : "owner"
})
userSchema.methods.toPublicProfile = async function () {
    const user = this
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    return userObject
}
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id : user._id.toString() }, process.env.JWT_TOKEN)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        console.log(user)
        throw new Error("Unable to login")
        
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        console.log("Not user")
        throw new Error("Invalid password")
        
    }
    return user
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8)
    next()
})

userSchema.post('delete', async function(next){
    const user = this
    await Task.deleteMany({owner : user._id})
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User;