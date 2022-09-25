import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Patch,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukDto, ProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { InjectUser } from 'src/utils/decorator/inject-user.decorator';
import { join } from 'path';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { hasRoles } from 'src/utils/decorator/role.decorator';
import { UserRole } from 'src/auth/dto/auth.dto';
import LocalFileInterceptor from 'src/utils/interceptor/local-file.interceptor';
const fs = require('fs');
const path = '/produk';

@ApiTags('Produk')
@ApiBearerAuth()
@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  // @UseInterceptors(FileInterceptor('foto', storage))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProdukDto })
  @Post()
  @UseInterceptors(
    LocalFileInterceptor({
      fieldName: 'foto',
      path: path,
      fileCategory: 'produk',
    }),
  )
  @UseGuards(JwtGuard, RoleGuard)
  @hasRoles(UserRole.Admin)
  create(
    @InjectUser() createProdukDto: CreateProdukDto,
    @UploadedFile() foto: Express.Multer.File,
  ) {
    if (foto) {
      createProdukDto.foto = foto.filename;
    }
    return this.produkService.create(createProdukDto);
  }

  @Get()
  findAll() {
    return this.produkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produkService.findOne(+id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProdukDto })
  @Patch(':id')
  @UseInterceptors(
    LocalFileInterceptor({
      fieldName: 'foto',
      path: path,
      fileCategory: 'produk',
    }),
  )
  @UseGuards(JwtGuard, RoleGuard)
  update(
    @Param('id') id: number,
    @InjectUser() updateProdukDto: UpdateProdukDto,
    @UploadedFile() foto: Express.Multer.File,
  ) {
    this.findOne(id.toString()).then((produk: ProdukDto) => {
      if (foto) {
        this.checkFile(produk.foto);
        updateProdukDto.foto = foto.filename;
      }
      return this.produkService.update(id, updateProdukDto);
    });
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RoleGuard)
  remove(@Param('id') id: string) {
    this.findOne(id.toString()).then((produk: ProdukDto) => {
      if (produk.foto) {
        this.checkFile(produk.foto);
      }
    });
    return this.produkService.remove(+id);
  }

  @Get('foto/:namafoto')
  findProductPhoto(@Param('namafoto') imageName, @Res() res) {
    return res.sendFile(join(process.cwd(), 'assets/produk/' + imageName));
  }

  checkFile(filename: string) {
    const previousImagePath = `${process.env.UPLOADED_FILES_DESTINATION}/${path}/${filename}`;
    try {
      if (fs.existsSync(previousImagePath)) {
        fs.unlinkSync(previousImagePath);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
