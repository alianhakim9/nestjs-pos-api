import { ArgumentMetadata, Catch, HttpException, HttpStatus, PipeTransform } from "@nestjs/common";
import { extname } from "path";

export class FileSizeValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const twoKb = 2000;
        return value.size < twoKb;
    }
}

export const imageFileFilter = (req, file, callback) => {
    console.log(file);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
    }
    callback(null, true);
}

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
