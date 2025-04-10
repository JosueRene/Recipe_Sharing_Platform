const router = require('express').Router()
const Recipe = require('../models/recipe-model')

router.route('/recipes').get(async(req, res) => {
    const { recipeName, recipeDate, chefName, recipeInstructions } = req.params
    const recipePerPage = 1
    const pageNumber = req.query.pg || 0

    try {
        
        const recipes = await Recipe.find({}).skip(recipePerPage * pageNumber).limit(recipePerPage).populate('chefId', 'username email')
        if(!recipes || recipes.length === 0) {
            return res.status(404).json({message: "There's Currently No Recipes!"})
        }

        return res.status(200).json({message: "Here's Your Recipes!", recipes})
        
    } catch (error) {
        console.error("Failed To Retrieve Recipes", error)
        res.status(500).json({message: "Failed To Retrieve Recipes", error: error.message})
    }

})

router.route('/recipes/:id').get(async(req, res) => {
    const { id } = req.params

    try {
        
        const recipe = await Recipe.findOne({ _id: id }).populate('chefId', 'username email')
        if(!recipe) {
            return res.status(404).json({message: "Recipe Not Found!"})
        }

        return res.status(200).json({message: "Your Recipe is Retrieved!", recipe})

    } catch (error) {
        console.error("Failed To Retrieve Recipe", error)
        return res.status(500).json({message: "Failed To Retrieve Recipe", error: error.message})
    }
})


module.exports = router