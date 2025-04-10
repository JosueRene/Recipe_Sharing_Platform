const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const signupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user_role', 'chef_role'],
        default: 'user_role'
    }
}, {timestamps: true})

signupSchema.index({email: 1, role: 1}, {unique: true})

signupSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, role: this.role}, process.env.PRIVATEKEY, {expiresIn: '1d'})
    return token
}

const User = mongoose.model('User', signupSchema)

const validate = (data) => {
    const schema = joi.object({
        username: joi.string().required().label('Username'),
        email: joi.string().email().required().label('Email'),
        password: passwordComplexity().required().label('Password') 
    })

    return schema.validate(data)
}

module.exports = { User, validate }