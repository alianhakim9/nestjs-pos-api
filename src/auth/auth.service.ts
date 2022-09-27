import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists

    const userExists = await this.userService.findByUsername(
      createUserDto.username,
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = this.userService.hashData(createUserDto.password);
    createUserDto.password = hashedPassword;
    const newUser = await this.userService.create(createUserDto);
    const tokens = await this.getToken(newUser.id)
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto) {
    const user = await this.userService.findByUsername(data.username);
    // check if user exists
    if (user) {
      const passwordMatches = this.userService.compare(data.password, user.password);
      console.log(passwordMatches);
      if (!passwordMatches) throw new BadRequestException("password salah");
      const tokens = await this.getToken(user.id);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } else {
      throw new BadRequestException("user tidak ada");
    }
  }

  async logout(userId: number) {
    return this.userService.update(userId, {
      refresh_token: null
    })
  }

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

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.userService.hashData(refreshToken);
    await this.userService.update(userId, {
      refresh_token: hashedRefreshToken
    })
  }

  async getToken(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '30m'
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d'
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    }
  }

  async generateToken(user: any) {
    // masukan data yang akan dimasukan ke dalam token
    const dataToken = { id: user.id };
    const token = this.jwtService.sign(dataToken);
    return token;
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId)
    if (!user || !user.refresh_token) {
      throw new ForbiddenException("Access Denied")
    }
    const refreshTokenMatches = this.userService.compare(refreshToken, user.refresh_token);
    if (!refreshTokenMatches) throw new ForbiddenException("Access Denied");
    const tokens = await this.getToken(userId);
    return tokens;
  }
}
