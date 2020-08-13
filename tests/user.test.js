const request = require('supertest');
const app =require('../src/app');
const User = require('../src/models/users');
const jwt = require('jsonwebtoken');
const {setDatabase,userOne, userOneId} = require('./features/db');

beforeEach(setDatabase);



test("should signup", async () => {
   const response = await request(app).post('/signup').send({
        firstname:"oluwatosin",
        lastname:"baba",
        email:"oluwatosindavid393@gmail.com",
        password:"Mypass123"
    }).expect(201);

     
    // assert that database has changed
    // const user = await User.findById(response.body.user._id);
    // expect(user).not.toBeNull();
    
    // // assertions about the response
    // expect(response.body).toMatchObject({
    //     user:{
    //         firstname:'oluwatosin',
    //         lastname:'baba',
    //         email:'oluwatosindavid393@gmail.com'
    //     },
    //     // token:user.tokens[0].token
    // });
    // expect(user.password).not.toBe('Mypass123');


});

// test("should activate account", async() => {

//     const response = await request(app).post('/account-activation').send({

//     })
// })

test("should login", async () => {
   const response =  await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200);

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token)
});
test("should not login with invalid credential", async() => {
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:"this is my password"
    }).expect(400);
});

test("should be authorized to get profile", async()=>{
    await request(app)
    .get('/users/me')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
});

test('should not get user profile if not authenticated', async()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete an account for an authenticatd user', async()=>{
    await request(app)
    .delete('/users/me')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
})

test('should not delete an accout for unauthenticated user', async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
});

test('should upload an avatar images', async()=>{
    await request(app)
    .post('/users/me/avatar')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/features/davido.png')
    .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
    
});

test('should update users fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        firstname:"oladele"
    })
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user.firstname).toEqual('oladele')
});

test('should not update invalid fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
            location:"oladele"
    })
    .expect(400);

   
});

