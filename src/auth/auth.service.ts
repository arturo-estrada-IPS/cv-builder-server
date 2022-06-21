import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { getAuth as adminSdk, UserRecord } from 'firebase-admin/auth';
import {
  getAuth as clientSdk,
  signInWithEmailAndPassword,
} from 'firebase/auth';

@Injectable()
export class AuthService {
  private auth = adminSdk();
  private logger = new Logger('Auth');

  async signup(
    displayName: string,
    email: string,
    password: string,
    phoneNumber?: string,
  ): Promise<UserRecord> {
    try {
      const userRecord = await this.auth.createUser({
        email,
        password,
        displayName,
        phoneNumber,
        disabled: false,
      });

      return userRecord;
    } catch (error) {
      throw error;
    }
  }

  async signin(email: string, password: string) {
    try {
      const auth = clientSdk();
      const result = await signInWithEmailAndPassword(auth, email, password);
      const credentials = result.user.toJSON();

      return credentials;
    } catch (error) {
      this.logger.error('Auth [signin]', error);

      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        throw new UnauthorizedException('Username or Password do not match');
      }
      throw new InternalServerErrorException(error);
    }
  }
}
