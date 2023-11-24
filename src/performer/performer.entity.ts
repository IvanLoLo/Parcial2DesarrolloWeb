/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';

@Entity()
export class PerformerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    name: string;
    @Column()
    image: string;
    @Column()
    description: string;
    
    @ManyToMany(() => AlbumEntity, (album) => album.performers)
    albums: AlbumEntity[];
}
