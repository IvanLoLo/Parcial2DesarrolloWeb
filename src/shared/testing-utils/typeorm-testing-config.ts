/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from '../../album/album.entity';
import { PerformerEntity } from '../../performer/performer.entity';
import { TrackEntity } from '../../track/track.entity';

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [AlbumEntity, PerformerEntity, TrackEntity],
        synchronize: true,
        dropSchema: true,
        keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([AlbumEntity, PerformerEntity, TrackEntity]),
];