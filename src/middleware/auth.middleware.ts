import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { FirebaseApp } from './firebase-app';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private auth: Auth;

  constructor(private firebaseApp: FirebaseApp) {
    this.auth = firebaseApp.getAuth();
  }

  use(req: Request, res: Response, next: (error?: unknown) => void) {
    const token = req.headers['authorization'];
    if (token != null && token != '') {
      this.auth
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          req['user'] = {
            email: decodedToken.email,
            roles: decodedToken.roles || [],
            type: decodedToken.type,
          };
          next();
        })
        .catch(() => {
          this.accessDenied(req.url, res);
        });
    } else {
      this.accessDenied(req.url, res);
    }

    next();
  }

  private accessDenied = (url: string, res: Response) => {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Unauthorized',
    });
  };
}
