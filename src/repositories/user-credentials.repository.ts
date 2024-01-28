import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {UserCredentials, UserCredentialsRelations} from '../models';
import {DbDataSource} from '../datasources';

export class UserCredentialsRepository extends DefaultCrudRepository<
UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  constructor(
    @inject('datasources.db')
    dataSource: DbDataSource,
  ) {
    super(UserCredentials, dataSource);
  }
}
