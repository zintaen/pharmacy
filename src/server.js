import express from 'express';
import { expressLoader, mongooseLoader } from '~/utils/loaders';

export const app = express();

async function server() {
   await expressLoader(app);
   await mongooseLoader();

   return app;
}

server();
