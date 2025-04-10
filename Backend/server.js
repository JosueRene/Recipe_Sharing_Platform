const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// Use Express middleware
app.use(express.json())
app.use( '/uploads', express.static("uploads"))

// Use Body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Use Cookie-parser middleware
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// Use Cors
const cors = require('cors')
app.use(cors())

// Use dotenv
require('dotenv').config({path: "config.env"})

// Connect Database
const connectDB = require('./models/database')
connectDB()

// Use routers
const chefSignupRouter = require('./routers/chef_signup-router')
const chefLoginRouter = require('./routers/chef_login-router')
const userSignupRouter = require('./routers/user_signup_router')
const userLoginRouter = require('./routers/user_login_router')

const logoutRouter = require('./routers/logout-router')

const chefRecipeRouter = require('./routers/chef-recipe-router')
const userRecipeRouter = require('./routers/user-recipe-router')

app.use('/recipe-sharing-platform/account', chefSignupRouter)
app.use('/recipe-sharing-platform/account', chefLoginRouter)

app.use('/recipe-sharing-platform/account', userSignupRouter)
app.use('/recipe-sharing-platform/account', userLoginRouter)

app.use('/recipe-sharing-platform/account', logoutRouter)

app.use('/recipe-sharing-platform/admin-dashboard', chefRecipeRouter)
app.use('/recipe-sharing-platform/user-dashboard', userRecipeRouter)

app.listen(PORT, ()=> {
    console.log(`Server Is Running On PORT ${PORT}`)
})