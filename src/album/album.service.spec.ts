/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new album', async () => {
    const album: AlbumEntity = {
      id: '',
      name: 'Test Album',
      releaseDate: new Date(),
      cover: 'https://picsum.photos/200',
      description: 'Test Album Description',
      performers: [],
      tracks: [],
    };

    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();

    const storedAlbum: AlbumEntity = await repository.findOne({ where: { id: newAlbum.id } });
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.name).toEqual(newAlbum.name);
    expect(storedAlbum.releaseDate).toEqual(newAlbum.releaseDate);
    expect(storedAlbum.cover).toEqual(newAlbum.cover);
    expect(storedAlbum.description).toEqual(newAlbum.description);

  });

  it('create should throw an exception when the album description is empty', async () => {
    const album: AlbumEntity = {
      id: '',
      name: 'Test Album',
      releaseDate: new Date(),
      cover: 'https://picsum.photos/200',
      description: '',
      performers: [],
      tracks: [],
    };

    await expect(() => service.create(album)).rejects.toHaveProperty("message", "The album description is required.");

  });

});
