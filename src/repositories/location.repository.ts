import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Location, LocationRelations, LocationImage, Storyline, StorylineLocation, UserAccount, LocationVisit} from '../models';
import {LocationImageRepository} from './location-image.repository';
import {StorylineRepository} from './storyline.repository';
import {StorylineLocationRepository} from './storyline-location.repository';
import {LocationVisitRepository} from './location-visit.repository';
import {UserAccountRepository} from './user-account.repository';

export class LocationRepository extends DefaultCrudRepository<
  Location,
  typeof Location.prototype.id,
  LocationRelations
> {

  public readonly locationImages: HasManyRepositoryFactory<LocationImage, typeof Location.prototype.id>;

  public readonly storylines: HasManyThroughRepositoryFactory<Storyline, typeof Storyline.prototype.storylineID,
          StorylineLocation,
          typeof Location.prototype.id
        >;

  public readonly visitors: HasManyThroughRepositoryFactory<UserAccount, typeof UserAccount.prototype.accountId,
          LocationVisit,
          typeof Location.prototype.id
        >;
 // public readonly storylines: ReferencesManyAccessor<Storyline, typeof Location.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('LocationImageRepository') protected locationImageRepositoryGetter: Getter<LocationImageRepository>,
    @repository.getter('StorylineRepository') protected storylineRepositoryGetter: Getter<StorylineRepository>, @repository.getter('StorylineLocationRepository') protected storylineLocationRepositoryGetter: Getter<StorylineLocationRepository>, @repository.getter('LocationVisitRepository') protected locationVisitRepositoryGetter: Getter<LocationVisitRepository>, @repository.getter('UserAccountRepository') protected userAccountRepositoryGetter: Getter<UserAccountRepository>,
  ) {
    super(Location, dataSource);
    this.visitors = this.createHasManyThroughRepositoryFactoryFor('visitors', userAccountRepositoryGetter, locationVisitRepositoryGetter,);
    this.registerInclusionResolver('visitors', this.visitors.inclusionResolver);
    this.storylines = this.createHasManyThroughRepositoryFactoryFor('storylines', storylineRepositoryGetter, storylineLocationRepositoryGetter,);
    this.registerInclusionResolver('storylines', this.storylines.inclusionResolver);
    this.locationImages = this.createHasManyRepositoryFactoryFor('locationImages', locationImageRepositoryGetter,);
    this.registerInclusionResolver('locationImages', this.locationImages.inclusionResolver);

  }
  async findNearbyLocations(latitude: string, longitude: string, radius: number) : Promise<Location[]>{
    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    const locations  = await this.execute(
        `SELECT * FROM "location" 
         WHERE ST_DWithin(ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)::geography, 
             ST_SetSRID(ST_MakePoint(longitude::float, latitude::float), 4326)::geography, 
             ${radius})`
    )
    return locations as Location[];
  }
}
