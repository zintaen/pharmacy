import request from 'supertest';
import { app } from '~/server';

import UserModel, { USER_ROLES } from '~/models/user';

const loginPayload = {
   username: 'justin',
   password: 'Abc@1234'
}

const registerPayload = {
   username: 'justin',
   fullname: 'Justin Junior',
   email: 'justin@gmail.com',
   password: 'Abc@1234',
   address: '457/39 Cach mang thang tam',
   phone: '0123456789',
};

async function login() {
   const loginRes = await request(app)
      .post('/users/login')
      .send(loginPayload)
      .set('Accept', 'application/json');

   return loginRes;
}

beforeAll(async () => {
   await UserModel.deleteMany({ role: USER_ROLES.CUSTOMER });
});

describe('Auth route test suite', () => {
   describe('/users/register', () => {
      it('[POST] should response 422 with invalid data', async () => {
         const res = await request(app)
            .post('/users/register')
            .send({})
            .set('Accept', 'application/json');
   
         expect(res.statusCode).toBe(422);
      });
   
      it('[POST] should response 200 and account information with valid data', async () => {
         const res = await request(app)
            .post('/users/register')
            .send(registerPayload)
            .set('Accept', 'application/json');
   
         delete registerPayload.password;
         delete res.password;
   
         expect(res.statusCode).toBe(200);
         expect(res.body).toMatchObject(registerPayload);
      });
   });

   describe('/users/login', () => {
      it('[POST] should response 200 with token and user information when logged in', async () => {
         const res = await login();
   
         expect(res.statusCode).toBe(200);
         expect(res.body).toHaveProperty('token');
         expect(res.body).toHaveProperty('user');
      });
   
      it('[POST] should response 404 with message "login wrong information"', async () => {
         const res = await request(app)
            .post('/users/login')
            .send({})
            .set('Accept', 'application/json');
         
         expect(res.body.statusCode).toBe(403);
         expect(res.body.message).toBe('Login information wrong');
      });
   });

   describe('/users/me', () => {
      it('[GET] should response 200 with personal information (password field excepted)', async () => {
         const loginRes = await login();
         const info = await request(app).get('/users/me').set('Authorization', `Bearer ${loginRes.body.token}`);
         
         expect(loginRes.statusCode).toBe(200);

         expect(info.body).toHaveProperty('id');
         expect(info.body).not.toHaveProperty('password');
      });

      it('[GET] should response 401 with "Please login to use this API" message when missing authorization header', async () => {
         const info = await request(app).get('/users/me');
         
         expect(info.statusCode).toBe(401);
         expect(info.body.message).toBe('Please login to use this API');
      });
      
      it('[PATCH] should response 200 and updated information when update user', async () => {
         const resLogin = await login();

         const newFullname = `Stephen Cheng ${Math.random()}`;
         const info = await request(app)
            .patch('/users/me')
            .send({ fullname: newFullname })
            .set('Authorization', `Bearer ${resLogin.body.token}`);
         
         expect(info.statusCode).toBe(200);
         expect(info.body.fullname).toBe(newFullname);
      });
      
      it("[PATCH] should response 200 but didn't execute update process with these protected fields: username, email, id", async () => {
         const resLogin = await login();

         const newUsername = `Stephen Cheng ${Math.random()}`;
         const newEmail = 'updated@gmail.com';
         const info = await request(app)
            .patch('/users/me')
            .send({ username: newUsername, email: newEmail })
            .set('Authorization', `Bearer ${resLogin.body.token}`);
         
         expect(info.statusCode).toBe(200);
         expect(info.body.username).not.toBe(newUsername);
         expect(info.body.email).not.toBe(newEmail);
      });
   });
});