import request from 'supertest';
import { app } from '~/server';

import DrugModel from '~/models/drug';
import UserModel, { USER_ROLES } from '~/models/user';

const loginPayloads = {
   [USER_ROLES.ADMIN]: {
      username: 'admin',
      password: 'Abc@1234',
   },
   [USER_ROLES.CUSTOMER]: {
      username: 'justin',
      password: 'Abc@1234',
   },
};

const createDrugPayload = {
   name: 'Drug',
   price: 30000,
   description: 'description description',
};

async function auth({ role }) {
   const loginRes = await request(app)
      .post('/users/login')
      .send(loginPayloads[role])
      .set('Accept', 'application/json');

   const { token } = loginRes.body;

   if (token) {
      return token;
   }

   throw new Error('Fail to login');
}

beforeAll(async () => {
   await DrugModel.deleteMany({});
});

describe('Drug route test suite', () => {
   describe('/drugs', () => {
      it('[POST] should response 401 with "Please login to use this API" message if user not auth', async () => {
         const res = await request(app)
            .post('/drugs')
            .send(createDrugPayload)
            .set('Accept', 'application/json');

         expect(res.statusCode).toBe(401);
         expect(res.body.message).toBe('Please login to use this API');
      });

      it(`[POST] should response 403 with "You don't have permission as ADMIN" message if user role is CUSTOMER`, async () => {
         const token = await auth({ role: USER_ROLES.CUSTOMER });

         const res = await request(app)
            .post('/drugs')
            .send(createDrugPayload)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(403);
         expect(res.body.message).toBe("You don't have permission as ADMIN");
      });

      it('[POST] should response 200 with created Drug information if user role is ADMIN', async () => {
         const token = await auth({ role: USER_ROLES.ADMIN });

         const res = await request(app)
            .post('/drugs')
            .send(createDrugPayload)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(200);
         expect(res.body).toMatchObject(createDrugPayload);
      });

      it('[GET] should response 200 with list of drugs although user is auth or not', async () => {
         const res = await request(app).get('/drugs');

         expect(res.statusCode).toBe(200);
         expect(res.body).toEqual(
            expect.arrayContaining([
               expect.objectContaining({
                  name: expect.any(String),
                  price: expect.any(Number),
                  description: expect.any(String),
               }),
            ]),
         );
      });
   });

   describe('/drugs/:id', () => {
      it('[GET] should response specify drug information although user is auth or not', async () => {
         const drugs = await request(app).get('/drugs');
         const drugId = drugs.body[0]._id;

         const res = await request(app).get(`/drugs/${drugId}`);

         expect(res.statusCode).toBe(200);
         expect(res.body).toHaveProperty('name');
         expect(res.body).toHaveProperty('price');
         expect(res.body).toHaveProperty('description');
      });

      it('[PATCH] should response 422 with "Data validate failed! Please check again" message if user submit wrong data type', async () => {
         const token = await auth({ role: USER_ROLES.ADMIN });
         const drugs = await request(app).get('/drugs');
         const drugId = drugs.body[0]._id;

         const updatePayload = {
            name: 1,
            price: '5000',
         };
         const res = await request(app)
            .patch(`/drugs/${drugId}`)
            .send(updatePayload)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(422);
         expect(res.body.message).toBe(
            'Data validate failed! Please check again',
         );
      });

      it(`[PATCH] should response 403 with "You don't have permission as ADMIN" message if user login as Customer role`, async () => {
         const token = await auth({ role: USER_ROLES.CUSTOMER });
         const drugs = await request(app).get('/drugs');
         const drugId = drugs.body[0]._id;

         const updatePayload = {
            name: 'updated product',
            price: '5000',
         };
         const res = await request(app)
            .patch(`/drugs/${drugId}`)
            .send(updatePayload)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(403);
         expect(res.body.message).toBe(`You don't have permission as ADMIN`);
      });

      it('[PATCH] should response 401 with "Please login to use this API" message if user no auth', async () => {
         const updatePayload = {
            name: 'Updated product',
            price: '5000',
         };

         const res = await request(app)
            .patch(`/drugs/1`)
            .send(updatePayload)
            .set('Accept', 'application/json');

         expect(res.statusCode).toBe(401);
         expect(res.body.message).toBe('Please login to use this API');
      });

      it('[PATCH] should response 200 with updated drug information if user is Admin', async () => {
         const token = await auth({ role: USER_ROLES.ADMIN });
         const drugs = await request(app).get('/drugs');
         const drugId = drugs.body[0]._id;

         const updatePayload = {
            name: `Updated product ${Math.random()}`,
            price: 5000,
         };

         const res = await request(app)
            .patch(`/drugs/${drugId}`)
            .send(updatePayload)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(200);
         expect(res.body).toHaveProperty('name');
         expect(res.body).toHaveProperty('price');
         expect(res.body).toHaveProperty('description');
      });

      it('[PATCH] should response 404 with "Drug not found" message if someone fake ID', async () => {
         const token = await auth({ role: USER_ROLES.ADMIN });

         const updatePayload = {
            name: `Updated product ${Math.random()}`,
            price: 5000,
         };

         const res = await request(app)
            .patch(`/drugs/5f49f1ddee3c0714adb18061`)
            .send(updatePayload)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(404);
         expect(res.body.message).toBe('Drug not found');
      });

      it('[PATCH] should response 500 with "Server error" message if user submit not valid format ID', async () => {
         const token = await auth({ role: USER_ROLES.ADMIN });

         const updatePayload = {
            name: `Updated product ${Math.random()}`,
            price: 5000,
         };

         const res = await request(app)
            .patch(`/drugs/wrongFormat`)
            .send(updatePayload)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(500);
         expect(res.body.message).toBe('Server error');
      });

      it('[DELETE] should response 401 with "Please login to use this API" message if use no auth', async () => {
         const res = await request(app).delete(
            `/drugs/5f49f1ddee3c0714adb18061`,
         );

         expect(res.statusCode).toBe(401);
         expect(res.body.message).toBe('Please login to use this API');
      });

      it('[DELETE] should response 404 with "Drug does not exist!" message if use someone fake ID', async () => {
         const token = await auth({ role: USER_ROLES.ADMIN });

         const res = await request(app)
            .delete(`/drugs/5f49f1ddeeac0714adb18061`)
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(404);
         expect(res.body.message).toBe('Drug does not exist!');
      });

      it('[DELETE] should response 500 with "Server error" message if user submit invalid format ID', async () => {
         const token = await auth({ role: USER_ROLES.ADMIN });

         const res = await request(app)
            .delete(`/drugs/wrongFormat`)
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(500);
         expect(res.body.message).toBe('Server error');
      });

      it('[DELETE] should response 500 with "Server error" message if user submit invalid format ID', async () => {
         const token = await auth({ role: USER_ROLES.ADMIN });

         const res = await request(app)
            .delete(`/drugs/wrongFormat`)
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(500);
         expect(res.body.message).toBe('Server error');
      });

      it(`[DELETE] should response 403 with "You don't have permission as ADMIN" message if user role is CUSTOMER`, async () => {
         const token = await auth({ role: USER_ROLES.CUSTOMER });
         const drugs = await request(app).get('/drugs');
         const drugId = drugs.body[0]._id;

         const res = await request(app)
            .delete(`/drugs/${drugId}`)
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(403);
         expect(res.body.message).toBe(`You don't have permission as ADMIN`);
      });

      it('[DELETE] should response 200 with deleted drug information', async () => {
         const token = await auth({ role: USER_ROLES.ADMIN });
         const drugs = await request(app).get('/drugs');
         const drugId = drugs.body[0]._id;

         const res = await request(app)
            .delete(`/drugs/${drugId}`)
            .set('Authorization', `Bearer ${token}`);

         expect(res.statusCode).toBe(200);
         expect(res.body).toHaveProperty('name');
         expect(res.body).toHaveProperty('price');
         expect(res.body).toHaveProperty('description');
      });
   });
});
