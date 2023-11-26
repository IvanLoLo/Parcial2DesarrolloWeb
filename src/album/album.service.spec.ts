/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];

  const seedDatabase = async () => {
    repository.clear();
    albumsList = [];
    for (let i = 0; i < 5; i++) {
      const album: AlbumEntity = await repository.save({
        name: faker.lorem.words(3),
        releaseDate: faker.date.past(),
        cover: faker.image.url(),
        description: faker.lorem.paragraph(),
        performers: [],
        tracks: [],
      });
      albumsList.push(album);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all albums', async () => {
    const albums: AlbumEntity[] = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums).toHaveLength(albumsList.length);
  });

  it('findOne should return an album', async () => {
    const storedAlbum: AlbumEntity = albumsList[0];
    const album: AlbumEntity = await service.findOne(storedAlbum.id);
    expect(album).not.toBeNull();
    expect(album.name).toEqual(storedAlbum.name);
    expect(album.releaseDate).toEqual(storedAlbum.releaseDate);
    expect(album.cover).toEqual(storedAlbum.cover);
    expect(album.description).toEqual(storedAlbum.description);
  });

  it('findOne should throw an exception when the album does not exist', async () => {
    await expect(() => service.findOne('123')).rejects.toHaveProperty("message", "The album with the given id was not found.");
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
  
  it('create should throw an exception when the album name is empty', async () => {
    const album: AlbumEntity = {
      id: '',
      name: '',
      releaseDate: new Date(),
      cover: 'https://picsum.photos/200',
      description: 'Test Album Description',
      performers: [],
      tracks: [],
    };

    await expect(() => service.create(album)).rejects.toHaveProperty("message", "The album name is required.");

  });

  it('delete should remove an album', async () => {
    const storedAlbum: AlbumEntity = albumsList[0];
    await service.delete(storedAlbum.id);

    const deletedAlbum: AlbumEntity = await repository.findOne({ where: { id: storedAlbum.id } });
    expect(deletedAlbum).toBeNull();
  });

  it('delete should throw an exception when the album does not exist', async () => {
    await expect(() => service.delete('123')).rejects.toHaveProperty("message", "The album with the given id was not found.");
  });

});