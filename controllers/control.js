const Password = require('../models/password')
const jwt = require('jsonwebtoken')
const age = 1000*60*24*24

module.exports.get_signup = (req,res) =>{
    try{
        res.render('singup.ejs',{password: new Password()})
    }catch(Err){
        console.log(Err)
        res.redirect('/')
    }
}
module.exports.post_signup =async (req,res) =>{
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    }
    try{
        const User = await Password.create(newUser)
        const token = await createToken(User.id)
        await User.save()
        res.cookie('port_1',token,{maxAge: age , httpOnly: true})
        res.status(201).json({user: User})
    }catch(err){
        let errors =await handleErrors(err)
        res.status(400).json({errors: errors})
    }
}

module.exports.get_login = async(req,res) =>{
    try{
        res.render('login.ejs',{
            password: new Password()
        })
    }catch(err){
        res.redirect('/')
    }
}

module.exports.post_login = async(req,res) =>{
    const {email,password} = req.body
    try{
        let User = await Password.login(email,password)
        const token = await createToken(User.id)
        res.cookie('port_1',token,{maxAge: age , httpOnly: true})
        res.status(200).json({user: User})
    }catch(err){
        console.log(err.message)
        let errors =await handleErrors(err)
        res.status(400).json({errors: errors})
    }
}

module.exports.logout = async(req,res) =>{
    res.cookie('port_1','',{maxAge: 1})
    res.redirect('/login')
}

function handleErrors(error){

    let errors = {firstName: '',lastName: '',email: '',password: ''}

    if(error.code == 11000){
        errors.email = 'pleace input currect email'
    }
    if(error.message.includes('Password validation failed')){
        Object.values(error.errors).forEach(err =>{
            errors[err.path] = err.message
        })
    }
    if(error.message == 'pleace try withor strong password'){
        errors.password = 'pleace try with strong password'
    }
    if(error.message =='Incurrect password'){
        errors.password = 'Incurrect password'
    }
    if(error.message == 'Pleace try with another email'){
        errors.email = 'Pleace try with another email'
    }
    return errors
}

async function createToken(id){
    return jwt.sign({id},'Tg4vu4^ELW"v/iSx)#$&^!#@@###!NKJ+',{expiresIn: age*2})
}