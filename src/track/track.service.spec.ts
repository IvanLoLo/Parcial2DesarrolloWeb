/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TrackService } from './track.service';
import { AlbumService } from '../album/album.service';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from '../album/album.entity';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let tracksList: TrackEntity[];
  let album: AlbumEntity;

  const seedDatabase = async () => {
    repository.clear();
    tracksList = [];
    for (let i = 0; i < 5; i++) {
      const track: TrackEntity = await repository.save({
        name: faker.lorem.words(3),
        duration: faker.number.int({ min: 30, max: 200 }),
      });
      tracksList.push(track);
    }

    album = await repository.manager.save(AlbumEntity, {
      name: faker.lorem.words(3),
      releaseDate: faker.date.past(),
      cover: faker.image.url(),
      description: faker.lorem.paragraph(),
      tracks: tracksList,
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService, AlbumService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return a list of tracks', async () => {
    const storedTracks: TrackEntity[] = await service.findAll(album.id);
    expect(storedTracks).toEqual(tracksList);
  });

  it('findOne should return a track', async () => {
    const storedTrack: TrackEntity = await service.findOne(album.id, tracksList[0].id);
    expect(storedTrack).toEqual(tracksList[0]);
  });

  it('findOne should throw an error if the album does not exist', async () => {
    await expect(service.findOne('invalid-album-id', tracksList[0].id)).rejects.toHaveProperty('message', 'The album with the given id was not found.');
  });

  it('findOne should throw an error if the track does not exist', async () => {
    await expect(service.findOne(album.id, 'invalid-track-id')).rejects.toHaveProperty('message', 'The track with the given id was not found.');
  });

  it('create should return a track', async () => {
    const track: TrackEntity = {
      id: '',
      name: faker.lorem.words(3),
      duration: faker.number.int({ min: 30, max: 200 }),
      album: null,
    };
    const storedTrack: TrackEntity = await service.create(album.id, track);
    expect(storedTrack).toEqual(track);
  });

});