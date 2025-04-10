const RevokedToken = require('../models/revokedToken-model')
const jwt = require('jsonwebtoken')

const chefAuth = async(req, res, next) => {
    try {
        
        const token = req.cookies.AuthToken
        if(!token) {
            return res.status(400).json({message: "No Token Found!"})
        }

        // Check whether the token is revoked
        const isRevoked = await RevokedToken.findOne({ token })
        if(isRevoked) {
            return res.status(400).json({message: "Token Revoked!"})
        }

        const decodedToken = jwt.verify(token, process.env.PRIVATEKEY)
        if(decodedToken.role !== 'chef_role') {
            return res.status(403).json({message: "Access Denied. Only Chefs Allowed!"})
        }

        req.chef = decodedToken

        next();

    } catch (error) {
        console.error(error.message)
        return res.status(403).json({ message: "Invalid Token!" });
    }
}

module.exports = chefAuth