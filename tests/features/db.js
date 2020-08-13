const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/users');
const Asset = require('../../src/models/assets');

const userOneId= new mongoose.Types.ObjectId();
const userOne= {
    _id:userOneId,
    firstname:"taiwo",
    lastname:"dads",
    email:"adolad2019@test.com",
    password:"What56!!"
}

const userTwoId= new mongoose.Types.ObjectId();

const userTwo= {
    _id:userTwoId,
    firstname:"ogunwale",
    lastname:"muri",
    email:"adolad@test.com",
    password:"Whadst562!!"
}

const assetOne = {
    _id: new mongoose.Types.ObjectId(),
    type:'assets',
    compound:true,
    apr:3,
    amount: 4000,
    name:"rents",
    owner:userOne._id

}

const assetTwo = {
    _id:new mongoose.Types.ObjectId(),
    type:'assets',
    compound:true,
    apr:3,
    amount: 3000,
    name:"tax",
    owner:userOne._id
}

const assetThree = {
    _id:new mongoose.Types.ObjectId(),
    type:'assets',
    compound:false,
    apr:5,
    amount: 4000,
    name:"land",
    owner:userTwo._id

}


const setDatabase = async () => {
    await User.deleteMany();
    await Asset.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Asset(assetOne).save();
    await new Asset(assetTwo).save();
    await new Asset(assetThree).save();


}

module.exports = {
    setDatabase,
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    assetOne,
    assetTwo,
    assetThree
}