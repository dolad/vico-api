const request = require('supertest');
const app =require('../src/app');
const Asset = require('../src/models/assets')
const {setDatabase,userOne, userOneId, userTwo,
    userTwoId,
    assetOne,
    assetTwo,
    assetThree } = require('./features/db');

beforeEach(setDatabase);

test('should create an asset', async()=>{
    const response = await request(app)
    .post('/assets')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        compound:true,
        apr:3,
        amount: 4000,
        name:"rents"
    })
    .expect(201);

    const asset = await Asset.findById(response.body._id);
    
    expect(asset).not.toBeNull();
    expect(asset.compound).toEqual(true)
});

test('should be able to get an asset for authorized user', async () => {
    const response = await request(app)
    .get('/assets')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    expect(response.body.length).toEqual(2)
})

test('should not delete other users task', async () => {
    const response = await request(app)
    .delete(`/assets/${assetOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

    const assets = await Asset.findById(assetOne._id);
    expect(assets).not.toBeNull();
    
})
