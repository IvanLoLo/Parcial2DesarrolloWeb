/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { PerformerEntity } from '../performer/performer.entity';
import { TrackEntity } from '../track/track.entity';

@Entity()
export class AlbumEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;
    @Column()
    releaseDate: Date;
    @Column()
    cover: string;
    @Column()
    description: string;
    
    @ManyToMany(() => PerformerEntity, (performer) => performer.albums)
    @JoinTable()
    performers: PerformerEntity[];

    @OneToMany(() => TrackEntity, (track) => track.album)
    tracks: TrackEntity[];
}
