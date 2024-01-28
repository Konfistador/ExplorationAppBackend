import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Count, Entity, model, property, repository} from '@loopback/repository';
import {
  SchemaObject,
  get,
  getModelSchemaRef,
  post,
  del,
  HttpErrors,
  response,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {TokenServiceBindings, UserAuthenticationServiceBindings} from '../keys';
import {UserAuthentication} from '../models';
import {LeaderboardRepository, UserAccountRepository, UserAuthenticationRepository} from '../repositories';
import {Credentials, JWTService, UserAuthenticationService} from '../services';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    deviceToken: {
      type: 'string',
    }
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

@model()
class SignUpModel extends Entity {
  @property({
    type: 'string',
    jsonSchema: {
      format: 'email',
    },
    required: true
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  username: string;

  @property({
    type: 'string',
    required: false
  })
  profilePicture?: string

  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(UserAuthenticationServiceBindings.USER_SERVICE)
    public userAuthenticationService: UserAuthenticationService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserAuthenticationRepository) protected userAuthenticationRepository: UserAuthenticationRepository,
    @repository(UserAccountRepository) protected accountRepository: UserAccountRepository,
    @repository(LeaderboardRepository) private leaderBoardRepository: LeaderboardRepository,
  ) { }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) userCredentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userAuthenticationService.verifyCredentials(userCredentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userAuthenticationService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    // update User's device token
    await this.accountRepository.updateById(user.id, {deviceToken: userCredentials.deviceToken});

    return {token};
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SignUpModel, {
              title: 'User-Authentication and User-Account',
              exclude: ["password"]
            })
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignUpModel, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: SignUpModel,
  ): Promise<UserAuthentication> {
    if (
      newUserRequest.profilePicture == undefined ||
      newUserRequest.profilePicture == '' ||
      newUserRequest.profilePicture == 'string'
    )
      newUserRequest.profilePicture = `iVBORw0KGgoAAAANSUhEUgAABAAAAAQAAgMAAAACc8MQAAAADFBMVEXFxcX\/\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`;

    newUserRequest.username = newUserRequest.username.trim();

    if (newUserRequest.username == 'string')
      throw new HttpErrors.BadRequest('Please provide a username!');
    if (newUserRequest.username!.length < 4)
      throw new HttpErrors.BadRequest('Username too short.');

    const uniqueUsername: Promise<Count> = this.accountRepository.count({username: newUserRequest.username});

    if((await uniqueUsername).count > 0) {
      throw new HttpErrors.BadRequest('Username is already in use. Please provide a new username!');
    }

    const password = await hash(newUserRequest.password, await genSalt());

    const savedUser = await this.userAuthenticationRepository.create(
      _.omit(newUserRequest, 'password', 'username', 'profilePicture'));
    await this.userAuthenticationRepository.userCredentials(savedUser.id).create({password});
    await this.accountRepository.create({
      accountId: savedUser.id,
      username: newUserRequest.username,
      profilePicture: newUserRequest.profilePicture,
      deviceToken: 'unsigned',
    });
    await this.leaderBoardRepository.create({
      accountId: savedUser.id
    });

    return savedUser;
  }

  @authenticate('jwt')
  @del('/deleteAccount')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteAccount(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ) {
    const id: number = Number(currentUserProfile[securityId]);

    await this.accountRepository.deleteById(id);
    await this.userAuthenticationRepository.userCredentials(id).delete();
    await this.userAuthenticationRepository.deleteById(id);
  }
}
