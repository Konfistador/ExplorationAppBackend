import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
import {UserAuthentication, UserAuthenticationWithRelations} from '../models';
import {UserAuthenticationRepository} from '../repositories';

/**
 * A pre-defined type for user credentials. It assumes a user logs in
 * using the email and password. You can modify it if your app has different credential fields
 */
export type Credentials = {
  email: string;
  password: string;
  deviceToken: string;
};

export class UserAuthenticationService implements UserService<UserAuthentication, Credentials> {
  constructor(
    @repository(UserAuthenticationRepository) public userAuthenticationRepository: UserAuthenticationRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<UserAuthentication> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userAuthenticationRepository.findOne({
      where: {email: credentials.email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userAuthenticationRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await compare(
      credentials.password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: UserAuthentication): UserProfile {
    return {
      [securityId]: user.id.toString(),
      id: user.id,
      email: user.email,
    };
  }

  //function to find user by id
  async findUserById(id: number): Promise<UserAuthentication & UserAuthenticationWithRelations> {
    const userNotfound = 'invalid User';
    const foundUser = await this.userAuthenticationRepository.findOne({
      where: {id: id},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound);
    }
    return foundUser;
  }
}
