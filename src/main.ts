import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './app.module';
import { TransformInterceptor } from './middleware';

const server = express();
const logger = new Logger('Server');

export const createNestServer = async (expreessInstance: express.Express) => {
  const adapter = new ExpressAdapter(expreessInstance);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    adapter,
    {},
  );

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  return app.init();
};

createNestServer(server)
  .then(() => logger.log('Nest Server Ready'))
  .catch((err) => logger.error('Nest Failed', err));

export const api = functions.https.onRequest(server);
