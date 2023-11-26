/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors, Post, Param } from '@nestjs/common';
import { PerformerAlbumService } from './performer-album.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerAlbumController {

    constructor(private readonly performerAlbumService: PerformerAlbumService) {}

    @Post(':albumId/performers/:performerId')
    async addPerformerToAlbum(@Param('performerId') performerId: string, @Param('albumId') albumId: string) {
        return await this.performerAlbumService.addPerformerToAlbum(performerId, albumId);
    }

}
