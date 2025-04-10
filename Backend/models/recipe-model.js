const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true,
        unique: true
    },
    recipeIngredients: {
        type: String,
        required: true
    },
    recipeImage: {
        type: String,
        required: true
    },
    chefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe