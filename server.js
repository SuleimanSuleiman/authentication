require('dotenv').config()

const express      = require('express')
const app          = express()
const bodyParser   = require('body-parser')
const router       = require('./router/routerPassword')
const mongoose     = require('mongoose')
const cookieParser = require('cookie-parser')
const {auth,checkUser}       = require('./middlewares/auth')
const routerHome  = require('./router/routerHome')

mongoose.connect(process.env.MONGODB,{useNewUrlParser: true})
const db = mongoose.connection
db.on('error',(error) => console.log(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())

app.use('*',checkUser)
app.use('/',router)
app.use('/home',auth,routerHome)
app.listen(process.env.PORT,() =>console.log('Server Running ... '))