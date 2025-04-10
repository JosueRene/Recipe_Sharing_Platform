const router = require('express').Router()
const { User } = require('../models/signup-model')
const bcrypt = require('bcrypt')
const joi = require('joi')
const limiter = require('express-rate-limit')
const chefAuth = require('../middlewares/chefAuthMiddleware')

const loginLimiter = limiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too Many Attempts. Try Again Later!"
})

router.route('/chef/login').post(loginLimiter, async(req, res) => {
    try {
        
        const { error } = validate(req.body)
        if(error) {
            console.error("Error Occured!", error.details[0].message)
            return res.status(400).json({message: "Error Occured!", error: error.details[0].message})
        }

        const chef = await User.findOne({ email: req.body.email, role: 'chef_role'})
        if(!chef) {
            return res.status(400).json({message: "Invalid Email!"})
        }

        const comparepassword = await bcrypt.compare(req.body.password, chef.password)
        if(!comparepassword) {
            return res.status(400).json({message: "Invalid Password!"})
        }

        // Generate token
        const token = chef.generateAuthToken()

        // Set HTTP-Only Cookie
        res.cookie('AuthToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        })

        return res.status(200).json({data: token, message: "Chef Logged In!", redirectUrl: '/recipe-sharing-platform/chef-dashboard'})
        
    } catch (error) {
        console.error("Failed To Login Chef!", error)
        return res.status(500).json({message: "Failed To Login Chef!", error: error.message})
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