/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { unlinkSync } from 'fs';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {
    Cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  public upload(path: string): Promise<string> {
    return new Promise(resolve => {
      Cloudinary.uploader.upload(
        path,
        {
          resource_type: 'auto',
          folder: 'sea-messages',
        },
        function(err, result) {
          unlinkSync(path);
          resolve(result.secure_url);
        },
      );
    });
  }

  public async multiUpload(files): Promise<string[]> {
    const urls = [];
    if (files && files.length) {
      for (const file of files) {
        const { path } = file;
        const newPath = await this.upload(path);
        urls.push(newPath);
      }
    }

    return urls;
  }
}
