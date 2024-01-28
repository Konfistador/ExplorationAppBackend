import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {
  UserAuthentication,
  UserCredentials,
  UserAuthenticationRelations,
} from '../models';
import {UserCredentialsRepository} from './user-credentials.repository';
import {DbDataSource} from '../datasources';

export class UserAuthenticationRepository extends DefaultCrudRepository<
  UserAuthentication,
  typeof UserAuthentication.prototype.id,
  UserAuthenticationRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof UserAuthentication.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(UserAuthentication, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }

  async findCredentials(
    userID: typeof UserAuthentication.prototype.id,
  ): Promise<UserCredentials | undefined> {
    return this.userCredentials(userID)
      .get()
      .catch(err => {
        if (err.code === 'ENTITY_NOT_FOUND') return undefined;
        throw err;
      });
  }
}
