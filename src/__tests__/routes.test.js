import request from 'supertest';
import { app } from '~/server';

describe("GET Endpoints", () => {
   it('Should GET /drugs response 200', async () => {
      const res = await request(app).get('/drugs');
      expect(res.statusCode === 200);
   });
});
