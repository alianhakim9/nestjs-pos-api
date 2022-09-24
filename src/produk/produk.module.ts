import { Module } from '@nestjs/common';
import { ProdukService } from './produk.service';
import { ProdukController } from './produk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from './entities/produk.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Produk]), UserModule],
  controllers: [ProdukController],
  providers: [ProdukService],
})
export class ProdukModule {}
