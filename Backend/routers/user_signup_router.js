const router = require('express').Router()
const { User, validate } = require('../models/signup-model')
const bcrypt = require('bcrypt')

router.route('/user/signup').post(async(req, res) => {
    try {
        
        const { error } = validate(req.body)
        if(error) {
            console.error("Error Occured!", error.details[0].message)
            return res.status(400).json({message: "Error Occured!", error: error.details[0].message})
        }

        const user = await User.findOne({ email: req.body.email})
        if(user && user.role === 'chef_role') {
            return res.status(400).json({message: "Chef With This Email Already Exists!"})
        }

        const saltpassword = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(req.body.password, saltpassword)

        await new User({...req.body, password: hashpassword, role: 'user_role'}).save()
        return res.status(200).json({message: "New User Registered!"})
        
    } catch (error) {
        console.error("Failed To Register User!", error)
        return res.status(500).json({message: "Failed To Register User!", error: error.message})
    }

})

module.exports = router