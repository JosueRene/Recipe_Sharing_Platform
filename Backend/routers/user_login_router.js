const router = require('express').Router()
const { User } = require('../models/signup-model')
const bcrypt = require('bcrypt')
const joi = require('joi')
const limiter = require('express-rate-limit')

const loginLimiter = limiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too Many Attempts. Try Again Later!"
})

router.route('/user/login').post(loginLimiter, async(req, res) => {
    try {
        
        const { error } = validate(req.body)
        if(error) {
            console.error("Error Occured!", error.details[0].message)
            return res.status(400).json({message: "Error Occured!", error: error.details[0].message})
        }

        const user = await User.findOne({ email: req.body.email, role: 'user_role'})
        if(!user) {
            return res.status(400).json({message: "Invalid Email!"})
        }

        const comparepassword = await bcrypt.compare(req.body.password, user.password)
        if(!comparepassword) {
            return res.status(400).json({message: "Invalid Password!"})
        }

        // Generate token
        const token = user.generateAuthToken()

        // Set HTTP-Only Cookie
        res.cookie('AuthToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        })

        return res.status(200).json({data: token, message: "User Logged In!", redirectUrl: '/recipe-sharing-platform/user-dashboard'})
        
    } catch (error) {
        console.error("Failed To Login User!", error)
        return res.status(500).json({message: "Failed To Login User!", error: error.message})
    }

})

const validate = (data) => {
    const schema = joi.object({
        email: joi.string().email().required().label('Email'),
        password: joi.string().required().label('Password') 
    })

    return schema.validate(data)
}

module.exports = router