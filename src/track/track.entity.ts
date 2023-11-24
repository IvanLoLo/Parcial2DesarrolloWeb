/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';

@Entity()
export class TrackEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;
    @Column()
    duration: number;

    @ManyToOne(() => AlbumEntity, (album) => album.tracks)
    album: AlbumEntity;

}
