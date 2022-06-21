import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware, FirebaseApp, LoggerMiddleware } from './middleware';

@Module({
  imports: [AuthModule],
  providers: [FirebaseApp],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).exclude('auth/(.*)').forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
