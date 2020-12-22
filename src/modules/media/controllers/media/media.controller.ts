import { MediaService } from './../../services/media.service';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Post,
  HttpStatus,
  Controller,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNameGenerator, imageFileFilter } from 'src/utils/media.utils';
@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  // upload single file
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: fileNameGenerator,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file): Promise<string> {
    try {
      return this.mediaService.upload(file.path);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to upload image',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('multi')
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: fileNameGenerator,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files): Promise<string[]> {
    try {
      return this.mediaService.multiUpload(files);
    } catch (error) {
      throw new HttpException(
        {
          error: 'Failed to upload images',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
