const jwt = require('jsonwebtoken')
const User = require('../models/password')

const auth = async(req,res,next) =>{
    const theToken = await req.cookies.port_1
    if(theToken){
        jwt.verify(theToken,'Tg4vu4^ELW"v/iSx)#$&^!#@@###!NKJ+',(err,encoded)=>{
            if(err){
                res.redirect('/login')
            }else{
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}

const checkUser =async(req,res,next) =>{
    const jwtToken = req.cookies.port_1
    if(jwtToken){
        jwt.verify(jwtToken,'Tg4vu4^ELW"v/iSx)#$&^!#@@###!NKJ+', async(err,decodedToken) =>{
            if(err){
                res.locals.user = null
                next()
            }else{
                const user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }
}


module.exports = {
    auth,
    checkUser
}