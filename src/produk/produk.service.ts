import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProdukDto, ProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { Produk } from './entities/produk.entity';

@Injectable()
export class ProdukService {
  constructor(
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
  ) { }

  create(createProdukDto: CreateProdukDto) {
    return this.produkRepository.save(createProdukDto);
  }

  findAll() {
    return this.produkRepository
      .find({
        relations: ['user'],
      })
      .then((produk: ProdukDto[]) => {
        produk.map((prod) => {
          delete prod.user.password;
          delete prod.user.username;
          delete prod.user.email;
          delete prod.user.refresh_token;
          return prod;
        });
        return produk;
      });
  }

  findOne(id: number) {
    return this.produkRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateProdukDto: UpdateProdukDto) {
    return this.produkRepository.update(id, updateProdukDto);
  }

  remove(id: number) {
    return this.produkRepository.delete(id);
  }
}
