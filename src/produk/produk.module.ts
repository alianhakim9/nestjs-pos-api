import { Module } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from './entities/produk.entity';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Produk]), UserModule, ConfigModule],
  controllers: [ProdukController],
  providers: [ProdukService],
})
export class ProdukModule {}
