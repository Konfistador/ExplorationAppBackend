import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Storyline, StorylineRelations, Location, StorylineLocation} from '../models';
import {LocationRepository} from './location.repository';
import {StorylineLocationRepository} from './storyline-location.repository';

export class StorylineRepository extends DefaultCrudRepository<
  Storyline,
  typeof Storyline.prototype.storylineID,
  StorylineRelations
> {

  public readonly locations: HasManyThroughRepositoryFactory<Location, typeof Location.prototype.id,
          StorylineLocation,
          typeof Storyline.prototype.storylineID
        >;
  // public readonly locations: HasManyRepositoryFactory<Location, typeof Storyline.prototype.storylineID>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('LocationRepository') protected locationRepositoryGetter: Getter<LocationRepository>, @repository.getter('StorylineLocationRepository') protected storylineLocationRepositoryGetter: Getter<StorylineLocationRepository>,
  ) {
    super(Storyline, dataSource);
    this.locations = this.createHasManyThroughRepositoryFactoryFor('locations', locationRepositoryGetter, storylineLocationRepositoryGetter,);
    this.registerInclusionResolver('locations', this.locations.inclusionResolver);
    // this.locations = this.createHasManyRepositoryFactoryFor('locations', locationRepositoryGetter,);
    // this.registerInclusionResolver('locations', this.locations.inclusionResolver);
  }
}
