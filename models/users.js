const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Asset = require('./assets');
const Services =require('./services');
const Expenses = require('./expenses');

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required : true,
        trim : true,
        validate(value){
            // safe strings
            const sqlinjection = /([$])/;
            if(sqlinjection.test(value)){
                throw new Error('not allowed ');
            }   
        }
    },
    lastname:{
        type: String,
        required : true,
        trim : true,
        validate(value){
            // safe strings
            const sqlinjection = /([$])/;
            if(sqlinjection.test(value)){
                throw new Error('not allowed ');
            }   
        }
    },
    email:{
        type: String,
        required : true,
        unique :true,
        trim : true,
        lowercase : true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("email must be a valid email");
            }
        }
    },
    password:{
        type : String,
        required : true,
        trim : true,
        minlength : 6,
        validate(value){
            // const letterNumberRegex  = /^[0-9a-zA-Z]+$/;
            // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
            if(value.toLowerCase().includes("password")){
                throw new Error('u cant set default password to be password');
            }
            
            // if(!regex.test(value)){
            //     throw new Error('should contain atleast one number, one lowercase and one uppercase letter ');
            // }
        
        }
    },
    role: {
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink: {
        data: String,
        default: ''
    },
    mobile:{
        type: Number,
    
    },
    resetPasswordLink: {
        data: String,
        default: ''
    },
    // tokens :[{
    //     token:{
    //         type: String,
    //         required : true
    //     }
    // }],
    avatar : {
        type : Buffer
    }
},{
 timestamps:true   
})


// generate auth token

// userSchema.methods.generateAuthToken = async function () {
//     const user = this;
//     const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
//     user.tokens = user.tokens.concat({token});
//     await user.save();
//     return token;

// }

// find the credentials


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user){
        throw new Error('User does not exist please signup');

    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Passwoord not match');
    }

    return user
 }

// delete some field to response 

userSchema.methods.toJSON = function (){
    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// for relatioinship for assets
userSchema.virtual('asset', {
    ref : "Asset",
    localField : '_id',
    foreignField : 'owner'
});

// for services relationship
userSchema.virtual('services', {
    ref : "Services",
    localField : '_id',
    foreignField : 'owner'
});

// for expenses relationship
userSchema.virtual('expenses', {
    ref : "Expenses",
    localField : '_id',
    foreignField : 'owner'
});


//  hash the plain text password
userSchema.pre('save', async function (next) {
    const user = this;
   
   //check if the password has been modified
   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password, 8)
   }  
    next();
});

// delete asset related to a user
userSchema.pre('remove', async function (next){

    const user = this;
    await Asset.deleteMany({owner : user._id});
    await Expenses.deleteMany({owner : user._id});
    await Services.deleteMany({owner : user._id});
    next();

})

const User = mongoose.model('User', userSchema );
module.exports = User;