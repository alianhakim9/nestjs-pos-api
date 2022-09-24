import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  async login(@Body() authDto: AuthDto) {
    const user = await this.authService.checkUser(
      authDto.username,
      authDto.password,
    );
    if (user) {
      return this.authService.generateToken({
        id: user.id,
      });
    }
  }
}
