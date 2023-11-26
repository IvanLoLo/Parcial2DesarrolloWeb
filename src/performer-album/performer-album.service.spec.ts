/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { PerformerAlbumService } from './performer-album.service';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumEntity } from '../album/album.entity';

describe('PerformerAlbumService', () => {
  let service: PerformerAlbumService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let album: AlbumEntity;
  let performersList: PerformerEntity[];

  const seedDatabase = async () => {
    albumRepository.clear();
    performerRepository.clear();
    performersList = [];
    for (let i = 0; i < 2; i++) {
      const performer: PerformerEntity = await performerRepository.save({
        name: faker.person.fullName(),
        image: faker.image.url(),
        description: faker.lorem.paragraph(1),
        albums: [],
      });
      performersList.push(performer);
    }

    album = await albumRepository.save({
      name: faker.lorem.words(3),
      releaseDate: faker.date.past(),
      cover: faker.image.url(),
      description: faker.lorem.paragraph(),
      performers: performersList,
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerAlbumService],
    }).compile();

    service = module.get<PerformerAlbumService>(PerformerAlbumService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPerformerToAlbum should add a performer to an album', async () => {
    const storedPerformer: PerformerEntity = performersList[0];
    const storedAlbum: AlbumEntity = await service.addPerformerToAlbum(storedPerformer.id, album.id);
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.performers).toHaveLength(performersList.length + 1);
  });

  it('addPerformerToAlbum should throw an exception when the performer does not exist', async () => {
    await expect(service.addPerformerToAlbum("123", album.id)).rejects.toHaveProperty("message", "The performer with the given id was not found");
  });

  it('addPerformerToAlbum should throw an exception when the album does not exist', async () => {
    const storedPerformer: PerformerEntity = performersList[0];
    await expect(service.addPerformerToAlbum(storedPerformer.id, "123")).rejects.toHaveProperty("message", "The album with the given id was not found");
  });

  it('addPerformerToAlbum should throw an exception when the album already has 3 performers', async () => {
    const performer: PerformerEntity = await performerRepository.save({
      name: faker.person.fullName(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(1),
      albums: [],
    });

    performersList.push(performer);
    const storedPerformer: PerformerEntity = performersList[0];

    const storedAlbum: AlbumEntity = await albumRepository.save({
      name: faker.lorem.words(3),
      releaseDate: faker.date.past(),
      cover: faker.image.url(),
      description: faker.lorem.paragraph(),
      performers: performersList,
    });
    await expect(service.addPerformerToAlbum(storedPerformer.id, storedAlbum.id)).rejects.toHaveProperty("message", "The album already has 3 performers");
  });

});