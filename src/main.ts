import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import * as functions from 'firebase-functions';

const server = express();

export const createNestServer = async (expreessInstance: express.Express) => {
  const adapter = new ExpressAdapter(expreessInstance);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    adapter,
    {},
  );

  app.enableCors();
  return app.init();
};

createNestServer(server)
  .then(() => console.log('Nest Ready'))
  .catch((err) => console.error('Nest Failed', err));

export const api = functions.https.onRequest(server);
