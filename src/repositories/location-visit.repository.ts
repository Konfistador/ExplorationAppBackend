import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LocationVisit, LocationVisitRelations} from '../models';

export class LocationVisitRepository extends DefaultCrudRepository<
  LocationVisit,
  typeof LocationVisit.prototype.visitId,
  LocationVisitRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LocationVisit, dataSource);
  }
}
