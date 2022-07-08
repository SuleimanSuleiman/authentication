const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcryptjs')

const passwordSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true,'pleace input the First name']
    },
    lastName:{
        type: String,
        required: [true,'pleace input the family name']
    },
    email:{
        type: String,
        required: [true,'pleace input the email'],
        validate: [isEmail,'pleace input currect email'],
        unique: [true,'pleace input with another email'],
        lowercase: true
    },
    password:{
        type: String,
        minlength: [6,'sholud be longer of 8'],
        required: [true,'pleace input password'],
    }
})

passwordSchema.pre('save',async function (next){

    if(!this.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ig)){
        throw Error('pleace try withor strong password')
    }
    if(this.password != null && this.password != ''){
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }
})

passwordSchema.statics.login = async function(email,password){
    const User = await this.findOne({email: email})
    if(User){
        const auth = await bcrypt.compare(password,User.password)
        if(auth){
            return User
        }else{
            throw Error('Incurrect password')
        }
    }else{
        throw Error('Pleace try with another email')
    }
}


module.exports = mongoose.model('Password',passwordSchema)