import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import {Trophy, TrophyRelations} from '../models';
import {DbDataSource} from '../datasources';
import {TrophyRoomRepository} from "./trophy-room.repository";

export class TrophyRepository extends DefaultCrudRepository<
  Trophy,
  typeof Trophy.prototype.trophyId,
  TrophyRelations
> {

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TrophyRoomRepository') protected trophyRoomRepositoryGetter: Getter<TrophyRoomRepository>,
  ) {
    super(Trophy, dataSource);
  }
}
