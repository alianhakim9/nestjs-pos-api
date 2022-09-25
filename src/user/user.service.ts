import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const hashedPassword = this.hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const updatedPassword = this.hashPassword(updateUserDto.password);
      updateUserDto.password = updatedPassword;
    }
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    this.userRepository.remove(user);
  }

  hashPassword(password: string) {
    const hashedPassword = bcrypt.hashSync(password, 12);
    return hashedPassword;
  }

  compare(password, hashPassword) {
    const valid = bcrypt.compareSync(password, hashPassword);
    return valid;
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
      select: ['id', 'username', 'password'],
    });
  }
}
