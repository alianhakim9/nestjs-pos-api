import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtGuard } from './guard/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('bearer');
    return {
      message: 'success',
    };
  }
}
