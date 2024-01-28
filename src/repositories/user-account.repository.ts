import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserAccount, UserAccountRelations, Trophy, TrophyRoom, Storyline, StorylineParticipation, Location, LocationVisit} from '../models';
import {TrophyRoomRepository} from './trophy-room.repository';
import {TrophyRepository} from './trophy.repository';
import {StorylineParticipationRepository} from './storyline-participation.repository';
import {StorylineRepository} from './storyline.repository';
import {LocationVisitRepository} from './location-visit.repository';
import {LocationRepository} from './location.repository';

export class UserAccountRepository extends DefaultCrudRepository<
  UserAccount,
  typeof UserAccount.prototype.accountId,
  UserAccountRelations
> {

  public readonly trophies: HasManyThroughRepositoryFactory<Trophy, typeof Trophy.prototype.trophyId,
          TrophyRoom,
          typeof UserAccount.prototype.accountId
        >;

  public readonly storylines: HasManyThroughRepositoryFactory<Storyline, typeof Storyline.prototype.storylineID,
          StorylineParticipation,
          typeof UserAccount.prototype.accountId
        >;

  public readonly locationsVisited: HasManyThroughRepositoryFactory<Location, typeof Location.prototype.id,
          LocationVisit,
          typeof UserAccount.prototype.accountId
        >;

  constructor(
      @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TrophyroomRepository') protected trophyroomRepositoryGetter: Getter<TrophyRoomRepository>, @repository.getter('TrophyRepository') protected trophyRepositoryGetter: Getter<TrophyRepository>, @repository.getter('LocationVisitRepository') protected locationVisitRepositoryGetter: Getter<LocationVisitRepository>, @repository.getter('LocationRepository') protected locationRepositoryGetter: Getter<LocationRepository>, @repository.getter('StorylineParticipationRepository') protected storylineParticipationRepositoryGetter: Getter<StorylineParticipationRepository>, @repository.getter('StorylineRepository') protected storylineRepositoryGetter: Getter<StorylineRepository>,
  ) {
    super(UserAccount, dataSource);
    this.locationsVisited = this.createHasManyThroughRepositoryFactoryFor('locationsVisited', locationRepositoryGetter, locationVisitRepositoryGetter,);
    this.registerInclusionResolver('locationsVisited', this.locationsVisited.inclusionResolver);
    this.trophies = this.createHasManyThroughRepositoryFactoryFor('trophies', trophyRepositoryGetter, trophyroomRepositoryGetter,);
    this.registerInclusionResolver('trophies', this.trophies.inclusionResolver);
    this.storylines = this.createHasManyThroughRepositoryFactoryFor('storylines', storylineRepositoryGetter, storylineParticipationRepositoryGetter,);
    this.registerInclusionResolver('storylines', this.storylines.inclusionResolver);
  }
}
