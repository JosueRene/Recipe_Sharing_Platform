const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const processImage = async(buffer, filename) => {

    const outputPath = path.join(__dirname, '../uploads', filename)

    if(!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath))
    }

    await sharp(buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 80 }) // 80% quality
            .toFile(outputPath)

    return `/uploads/${filename}`

}

module.exports = processImage