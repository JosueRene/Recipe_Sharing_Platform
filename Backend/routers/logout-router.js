const router = require('express').Router()
const jwt = require('jsonwebtoken')
const RevokedToken = require('../models/revokedToken-model')

router.route('/logout').post(async(req, res) => {
    try {
        
        console.log(req.cookies)

        const token = req.cookies.AuthToken
        if(!token) {
            return res.status(404).json({message: "No Token Found!"})
        }

        const jwtSecret = process.env.PRIVATEKEY
        const decodedToken = jwt.verify(token, jwtSecret)

        const expiresAt = new Date( decodedToken.exp * 1000 )

        await new RevokedToken({ token, expiresAt }).save()

        res.clearCookie('AuthToken')
        return res.status(200).json({message: "You Logged Out!"})

    } catch (error) {
        console.error('Logout Failed!', error)
        return res.status(500).json({message: "Logout Failed!", error: error.message})
    }
})

module.exports = router