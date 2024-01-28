import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {StorylineParticipation, StorylineParticipationRelations} from '../models';

export class StorylineParticipationRepository extends DefaultCrudRepository<
  StorylineParticipation,
  typeof StorylineParticipation.prototype.id,
  StorylineParticipationRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(StorylineParticipation, dataSource);
  }
}
