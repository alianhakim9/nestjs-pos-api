import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async checkUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (user) {
      const valid = this.userService.compare(password, user.password);
      if (valid) {
        return user;
      } else {
        throw new BadRequestException({
          message: 'Password salah',
        });
      }
    } else {
      throw new BadRequestException({
        message: 'Username tidak ditemukan',
      });
    }
  }

  async generateToken(user: any) {
    // masukan data yang akan dimasukan ke dalam token
    const dataToken = { id: user.id };
    const token = this.jwtService.sign(dataToken);
    return token;
  }
}
