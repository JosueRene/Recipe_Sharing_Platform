const multer = require('multer')
const path = require('path')

// configure Storage
const storage = multer.memoryStorage(); // Store image in memory before processing

const fileFilter = (req, file, cb) => {
    
    const allowedTypes = ['image/jpeg', 'image/png']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Invalid Image File Type. Only JPEG and PNG are allowed!"), false)
    }
}

const upload = multer({ storage, fileFilter })
module.exports = upload