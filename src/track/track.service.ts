/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from '../album/album.entity';
import { AlbumService } from '../album/album.service';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>,
        private readonly albumService: AlbumService,
    ) {}

    async findAll(albumId: string): Promise<TrackEntity[]> {
        const album: AlbumEntity = await this.albumService.findOne(albumId);
        if(!album) throw new BusinessLogicException('The album with the given id was not found.', BusinessError.NOT_FOUND);

        return album.tracks;
    }

    async findOne(albumId: string, trackId: string): Promise<TrackEntity> {
        const album: AlbumEntity = await this.albumService.findOne(albumId);
        if(!album) throw new BusinessLogicException('The album with the given id was not found.', BusinessError.NOT_FOUND);

        const track: TrackEntity = album.tracks.find(track => track.id === trackId);
        if(!track) throw new BusinessLogicException('The track with the given id was not found.', BusinessError.NOT_FOUND);

        return track;
    }

    async create(albumId:string, track: TrackEntity): Promise<TrackEntity> {
        const album: AlbumEntity = await this.albumService.findOne(albumId);
        if(!album) throw new BusinessLogicException('The album with the given id was not found.', BusinessError.NOT_FOUND);

        if(track.duration <= 0) throw new BusinessLogicException('The track duration must be greater than 0.', BusinessError.BAD_REQUEST);
        return await this.trackRepository.save(track);
    }

}
