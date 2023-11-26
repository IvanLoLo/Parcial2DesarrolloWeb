/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { PerformerService } from './performer.service';
import { PerformerEntity } from './performer.entity';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performersList: PerformerEntity[];

  const seedDatabase = async () => {
    repository.clear();
    performersList = [];
    for (let i = 0; i < 5; i++) {
      const performer: PerformerEntity = await repository.save({
        name: faker.person.fullName(),
        image: faker.image.url(),
        description: faker.lorem.paragraph(1),
        albums: [],
      });
      performersList.push(performer);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all performers', async () => {
    const performers: PerformerEntity[] = await service.findAll();
    expect(performers).not.toBeNull();
    expect(performers).toHaveLength(performersList.length);
  });

  it('findOne should return a performer', async () => {
    const storedPerformer: PerformerEntity = performersList[0];
    const performer: PerformerEntity = await service.findOne(storedPerformer.id);
    expect(performer).not.toBeNull();
    expect(performer.name).toEqual(storedPerformer.name);
    expect(performer.image).toEqual(storedPerformer.image);
    expect(performer.description).toEqual(storedPerformer.description);
  });

  it('findOne should throw an exception when the performer does not exist', async () => {
    await expect(service.findOne("123")).rejects.toHaveProperty("message", "The performer with the given id was not found.");
  });

  it('create should create a performer', async () => {
    const performer: PerformerEntity = {
      id: "",
      name: faker.person.fullName(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(1),
      albums: [],
    };

    const newPerformer: PerformerEntity = await service.create(performer);
    expect(newPerformer).not.toBeNull();

    const storedPerformer: PerformerEntity = await repository.findOne({ where: { id: newPerformer.id } });
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.name).toEqual(newPerformer.name);
    expect(storedPerformer.image).toEqual(newPerformer.image);
    expect(storedPerformer.description).toEqual(newPerformer.description);
  });

  it('create should throw an exception when the performer description is greater than 100 characters', async () => {
    const performer: PerformerEntity = {
      id: "",
      name: faker.person.fullName(),
      image: faker.image.url(),
      description: faker.lorem.paragraph(10),
      albums: [],
    };

    await expect(service.create(performer)).rejects.toHaveProperty("message", "The performer description must be less than 100 characters.");
  });

});