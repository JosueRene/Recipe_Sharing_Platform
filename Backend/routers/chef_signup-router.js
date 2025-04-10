const router = require('express').Router()
const { User, validate } = require('../models/signup-model')
const bcrypt = require('bcrypt')

router.route('/chef/signup').post(async(req, res) => {
    try {
        
        const { error } = validate(req.body)
        if(error) {
            console.error("Error Occured!", error.details[0].message)
            return res.status(400).json({message: "Error Occured!", error: error.details[0].message})
        }

        const chef = await User.findOne({ email: req.body.email, role: 'chef_role'})
        if(chef) {
            return res.status(400).json({message: "Chef With This Email Already Exists!"})
        }

        const saltpassword = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(req.body.password, saltpassword)

        await new User({...req.body, password: hashpassword, role: 'chef_role'}).save()
        return res.status(200).json({message: "New Chef Registered!"})
        
    } catch (error) {
        console.error("Failed To Register Chef!", error)
        return res.status(500).json({message: "Failed To Register Chef!", error: error.message})
    }

})

module.exports = router