import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

import { AuthService } from './auth.service';
import { AuthDto, UserRole } from './dto/auth.dto';
import { JwtGuard } from './guard/jwt.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  checkUser(@Request() req) {
    return req.user;
  }

  @Post()
  async login(
    @Body() authDto: AuthDto,
    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    const user = await this.authService.checkUser(
      authDto.username,
      authDto.password,
    );
    if (user) {
      const token = await this.authService.generateToken({
        id: user.id,
      });

      console.log(token);

      response.cookie('bearer', token, { httpOnly: true });

      return {
        token: token,
      };
    }
  }

  @Post("signin")
  signIn(
    @Body() data: AuthDto
  ) {
    return this.authService.signIn(data);
  }

  @Post("signup")
  signUp(
    @Body() data: CreateUserDto
  ) {
    return this.authService.signUp(data);
  }

  @UseGuards(JwtGuard)
  @Get("logout")
  logout(
    @Req() req: any
  ) {
    return this.authService.logout(req.user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh")
  refresh(
    @Req() req: any
  ) {
    const userId = req.user["sub"];
    const refresh_token = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refresh_token);
  }
}
