const router = require('express').Router()
const Recipe = require('../models/recipe-model')
const chefAuth = require('../middlewares/chefAuthMiddleware')
const processImage = require('../utilities/imageProcessor')
const upload = require('../utilities/upload')

router.route('/recipes').get(chefAuth, async(req, res) => {
    const chefId = req.chef._id

    try {
        
        const recipes = await Recipe.find({ chefId }).populate('chefId', 'username email')
        if(!recipes || recipes.length === 0) {
            return res.status(404).json({message: "You Have No Recipes!"})
        }

        return res.status(200).json({message: "Here's Your Recipes!", recipes})
        
    } catch (error) {
        console.error("Failed To Retrieve Your Recipes", error)
        res.status(500).json({message: "Failed To Retrieve Your Recipes", error: error.message})
    }

})

router.route('/recipes/add').post(chefAuth, upload.single('recipeImage'), async(req, res) => {
    const chefId = req.chef._id
    const { recipeName, recipeIngredients } = req.body

    try {
        
        const recipe = await Recipe.findOne({ recipeName })
        if(recipe) {
            return res.status(400).json({message: "You Already Have This Recipe!"})
        }

        if(!req.file) {
            return res.status(400).json({message: "Image is Required!"})
        }

        const filename = `recipe-${Date.now()}.jpeg`
        const imagePath = await processImage(req.file.buffer, filename)

        await new Recipe({ recipeName, recipeIngredients, recipeImage: imagePath, chefId }).save()
        return res.status(201).json({message: "Recipe Uploaded successfully!", Recipe})

    } catch (error) {
        console.error("Upload Failed!", error);
        return res.status(500).json({ message: "Upload Failed!", error: error.message });
    }

})

router.route('/recipes/:id').get(chefAuth, async(req, res) => {
    const chefId = req.chef._id
    const { id } = req.params

    try {
        
        const recipe = await Recipe.findOne({ _id: id, chefId }).populate('chefId', 'username email')
        if(!recipe) {
            return res.status(404).json({message: "Recipe Not Found!"})
        }

        return res.status(200).json({message: "Your Recipe is Retrieved!", recipe})

    } catch (error) {
        console.error("Failed To Retrieve Recipe", error)
        return res.status(500).json({message: "Failed To Retrieve Recipe", error: error.message})
    }
})

router.route('/recipes/update/:id').post(chefAuth, upload.single('recipeImage'), async(req, res) => {
    const { id } = req.params
    const { recipeName, recipeIngredients } = req.body
    const chefId = req.chef._id

    try{
        const recipe = await Recipe.findOne({ _id: id, chefId })
        if(!recipe) {
            return res.status(404).json({message: "Recipe Not Found!"})
        }

        recipe.recipeName = recipeName || recipe.recipeName
        recipe.recipeIngredients = recipeIngredients || recipe.recipeIngredients

        if(req.file) {
            const filename = `recipe-${Date.now()}.jpeg`
            const imagePath = await processImage(req.file.buffer, filename)
            recipe.recipeImage = imagePath
        }

        await recipe.save()
        return res.status(200).json({message: "Recipe Updated Successfully!", recipe})


    } catch(error) {
        console.error("Update Failed!", error)
        return res.status(500).json({ message: "Update Failed!", error: error.message })
    }
})

router.route('/recipes/delete/:id').delete(chefAuth, async(req, res) => {
    const { id } = req.params
    const chefId = req.chef._id

    try {
        
        const deletedRecipe = await Recipe.findOneAndDelete({ _id: id, chefId })
        if(!deletedRecipe) {
            return res.status(404).json({message: "Recipe Not Found!"})
        }
        
        return res.status(200).json({message: "Recipe Deleted!"})

    } catch (error) {
        console.error("Failed To Delete Recipe!", error)
        return res.status(500).json({message: "Failed To Delete Recipe!", error: error.messages})     
    }
})

module.exports = router