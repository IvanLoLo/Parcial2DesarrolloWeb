import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [AlbumService],
  imports: [TypeOrmModule.forFeature([AlbumEntity])],
})
export class AlbumModule {}
