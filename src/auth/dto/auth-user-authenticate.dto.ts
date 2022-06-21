import { IsNotEmpty } from 'class-validator';

export class AuthUserCredentials {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
