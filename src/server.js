/* eslint-disable no-console */
import express from 'express';
import { expressLoader, mongooseLoader } from '~/utils/loaders';

export const app = express();

async function server() {
   await expressLoader(app);
   await mongooseLoader();
}

server();
