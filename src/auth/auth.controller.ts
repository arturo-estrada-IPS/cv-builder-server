import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCreateUserDto } from './dto/auth-create-user.dto';
import { AuthUserCredentials } from './dto/auth-user-authenticate.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() authCreateUser: AuthCreateUserDto) {
    const { name, email, password, phoneNumber } = authCreateUser;
    return await this.authService.signup(name, email, password, phoneNumber);
  }

  @Post('/signin')
  async signin(@Body() credentials: AuthUserCredentials) {
    const { email, password } = credentials;
    return await this.authService.signin(email, password);
  }
}
