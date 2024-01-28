import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {StorylineLocation, StorylineLocationRelations} from '../models';

export class StorylineLocationRepository extends DefaultCrudRepository<
  StorylineLocation,
  typeof StorylineLocation.prototype.id,
  StorylineLocationRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(StorylineLocation, dataSource);
  }
}
