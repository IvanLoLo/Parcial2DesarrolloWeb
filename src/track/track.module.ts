import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumService } from 'src/album/album.service';
import { AlbumEntity } from 'src/album/album.entity';
import { TrackController } from './track.controller';

@Module({
  providers: [TrackService, AlbumService],
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])],
  controllers: [TrackController],
})
export class TrackModule {}
