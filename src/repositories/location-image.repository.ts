import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LocationImage, LocationImageRelations, Location} from '../models';
import {LocationRepository} from './location.repository';

export class LocationImageRepository extends DefaultCrudRepository<
  LocationImage,
  typeof LocationImage.prototype.id,
  LocationImageRelations
> {

  public readonly location: BelongsToAccessor<Location, typeof LocationImage.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('LocationRepository') protected locationRepositoryGetter: Getter<LocationRepository>,
  ) {
    super(LocationImage, dataSource);
    this.location = this.createBelongsToAccessorFor('location', locationRepositoryGetter,);
    this.registerInclusionResolver('location', this.location.inclusionResolver);
  }
}
