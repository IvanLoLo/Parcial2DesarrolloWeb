/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors, Get, Post, Param, Body } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { TrackDto } from './track.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';


@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {

    constructor(private readonly trackService: TrackService) {}

    @Get(':albumId/tracks')
    async findAll(@Param('albumId') albumId: string) {
        return await this.trackService.findAll(albumId);
    }

    @Get(':albumId/tracks/:trackId')
    async findOne(@Param('albumId') albumId: string, @Param('trackId') trackId: string) {
        return await this.trackService.findOne(albumId, trackId);
    }

    @Post(':albumId/tracks')
    async create(@Param('albumId') albumId: string, @Body() trackDto: TrackDto) {
        const track: TrackEntity = plainToInstance(TrackEntity, trackDto);
        return await this.trackService.create(albumId, track);
    }

}
