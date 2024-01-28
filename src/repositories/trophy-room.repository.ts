import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TrophyRoom, TrophyRoomRelations, Trophy} from '../models';
import {TrophyRepository} from './trophy.repository';

export class TrophyRoomRepository extends DefaultCrudRepository<
  TrophyRoom,
  typeof TrophyRoom.prototype.id,
  TrophyRoomRelations
> {

  public readonly trophy: HasOneRepositoryFactory<Trophy, typeof TrophyRoom.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TrophyRepository') protected trophyRepositoryGetter: Getter<TrophyRepository>,
  ) {
    super(TrophyRoom, dataSource);
    this.trophy = this.createHasOneRepositoryFactoryFor('trophy', trophyRepositoryGetter);
    this.registerInclusionResolver('trophy', this.trophy.inclusionResolver);
  }
}
