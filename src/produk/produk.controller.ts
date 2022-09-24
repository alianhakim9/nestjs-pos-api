import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukDto, ProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InjectUser } from 'src/utils/decorator/inject-user.decorator';
import { extname, join } from 'path';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { hasRoles } from 'src/utils/decorator/role.decorator';
import { UserRole } from 'src/auth/dto/auth.dto';
const fs = require('fs');
const path = './assets/produk';

const storage = {
  storage: diskStorage({
    destination: path,
    filename: (req: any, file, cb) => {
      const filename = ['produk', req.user.id, Date.now()].join('-');
      const extension = extname(file.originalname);
      cb(null, `${filename}${extension}`);
    },
  }),
};

@ApiTags('Produk')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Post()
  @UseInterceptors(FileInterceptor('foto', storage))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProdukDto })
  @UseGuards(RoleGuard)
  @hasRoles(UserRole.Admin)
  create(
    @InjectUser() createProdukDto: CreateProdukDto,
    @UploadedFile() foto: Express.Multer.File,
  ) {
    createProdukDto.foto = foto.filename;
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

  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto', storage))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProdukDto })
  update(
    @Param('id') id: number,
    @InjectUser() updateProdukDto: UpdateProdukDto,
    @UploadedFile() foto: Express.Multer.File,
  ) {
    this.findOne(id.toString()).then((produk: ProdukDto) => {
      if (foto) {
        const previousImagePath = `${path}/${produk.foto}`;
        try {
          if (fs.existsSync(previousImagePath)) {
            fs.unlinkSync(previousImagePath);
          }
        } catch (err) {
          console.log(err);
        }
        updateProdukDto.foto = foto.filename;
      }
      return this.produkService.update(id, updateProdukDto);
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produkService.remove(+id);
  }

  @Get('foto/:namafoto')
  findProductPhoto(@Param('namafoto') imageName, @Res() res) {
    return res.sendFile(join(process.cwd(), 'assets/produk/' + imageName));
  }
}
