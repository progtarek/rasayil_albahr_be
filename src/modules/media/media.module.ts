import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media/media.controller';

@Module({
  controllers: [MediaController]
})
export class MediaModule {}
