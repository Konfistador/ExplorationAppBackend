import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  model,
  property,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {UserAccount} from '../models';
import {
  LeaderboardRepository,
  LocationVisitRepository,
  StorylineParticipationRepository,
  TrophyRoomRepository,
  UserAccountRepository,
} from '../repositories';

@model()
export class UserAccountWithStatistics extends UserAccount {
  @property({
    type: 'number',
    required: true,
  })
  locationsVisitedCount?: number;

  @property({
    type: 'number',
    required: true,
  })
  storylinesCompletedCount?: number;

  @property({
    type: 'number',
    required: true,
  })
  trophiesEarnedCount?: number;

  @property({
    type: 'number',
    required: true,
  })
  points?: number;
}

@authenticate('jwt')
export class UserAccountController {
  constructor(
    @repository(UserAccountRepository)
    public userAccountRepository: UserAccountRepository,
    @repository(LocationVisitRepository)
    public locationVisitRepository: LocationVisitRepository,
    @repository(StorylineParticipationRepository)
    protected storylineParticipationRepository: StorylineParticipationRepository,
    @repository(TrophyRoomRepository)
    private trophyRoomRepository: TrophyRoomRepository,
    @repository(LeaderboardRepository)
    public leaderBoardRepository: LeaderboardRepository,
  ) {}

  @get('/user-accounts/count')
  @response(200, {
    description: 'UserAccount model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.userAccountRepository.count();
  }

  @get('/user-account')
  @response(200, {
    description: 'UserAccount model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserAccount),
        },
      },
    },
  })
  async findMyProfile(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserAccount> {
    return this.userAccountRepository.findById(
      parseInt(currentUserProfile[securityId]),
    );
  }

  @patch('/user-account/updateProfilePicture')
  @response(200, {
    description: 'Profile picture successfully updated',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserAccount),
        },
      },
    },
  })
  async updateProfilePicture(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              profilePicture: {type: 'string'},
            },
            required: ['profilePicture'],
          },
        },
      },
    })
    requestBody: {profilePicture: string},
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserAccount> {
    const id: number = parseInt(currentUserProfile[securityId]);

    if (
      requestBody.profilePicture == '' ||
      requestBody.profilePicture == 'string'
    ) {
      throw new HttpErrors.BadRequest(
        'Please provide a valid profile picture!',
      );
    }

    const partialUserAcc: Partial<UserAccount> = {
      profilePicture: requestBody.profilePicture,
    };

    await this.userAccountRepository.updateById(id, partialUserAcc);

    return this.userAccountRepository.findById(id);
  }

  @get('/user-account/all')
  @response(200, {
    description: 'UserAccountWithStatistics model instances.',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserAccountWithStatistics),
        },
      },
    },
  })
  async getAllProfileStatistics(): Promise<Object[]> {
    const allUsers: UserAccountWithStatistics[] =
      await this.userAccountRepository.find();

    return await Promise.all(
      allUsers.map(async user => {
        const points = await this.leaderBoardRepository.findOne({where: {accountId: user.accountId}});
        const pointsCount: number = points != null ? points.points : 0;

        const [
          visitedLocationsCount,
          storylinesCompletedCount,
          trophiesEarnedCount,
        ] = await Promise.all([
          this.locationVisitRepository.count({accountId: user.accountId}),
          this.storylineParticipationRepository.count({
            accountId: user.accountId,
            dateCompleted: {neq: null},
          }),
          this.trophyRoomRepository.count({accountId: user.accountId}),
        ]);

        return {
          ...user,
          locationsVisitedCount: visitedLocationsCount.count,
          storylinesCompletedCount: storylinesCompletedCount.count,
          trophiesEarnedCount: trophiesEarnedCount.count,
          points: pointsCount,
        };
      }),
    );
  }

  @get('/user-account/statistics')
  @response(200, {
    description: 'UserAccountWithStatistics model instance.',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserAccountWithStatistics),
      },
    },
  })
  async getProfileStatistics(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Object> {
    const user: UserAccountWithStatistics =
      await this.userAccountRepository.findById(
        Number(currentUserProfile[securityId]),
      );

    const points = await this.leaderBoardRepository.findOne({where: {accountId: user.accountId}});
    const pointsCount: number = points != null ? points.points : 0;

    const [
      visitedLocationsCount,
      storylinesCompletedCount,
      trophiesEarnedCount,
    ] = await Promise.all([
      this.locationVisitRepository.count({accountId: user.accountId}),
      this.storylineParticipationRepository.count({
        accountId: user.accountId,
        dateCompleted: {neq: null},
      }),
      this.trophyRoomRepository.count({accountId: user.accountId}),
    ]);

    return {
      ...user,
      locationsVisitedCount: visitedLocationsCount.count,
      storylinesCompletedCount: storylinesCompletedCount.count,
      trophiesEarnedCount: trophiesEarnedCount.count,
      points: pointsCount,
    };
  }

  @get('/user-account/statistics/{accountId}')
  @response(200, {
    description: 'UserAccountWithStatistics model instance.',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserAccountWithStatistics),
      },
    },
  })
  async getProfileStatisticsForSpecifiedUser(
    @param.path.number('accountId') accountId: number
  ): Promise<Object> {
    const user: UserAccountWithStatistics =
      await this.userAccountRepository.findById(accountId);

    const points = await this.leaderBoardRepository.findOne({where: {accountId: user.accountId}});
    const pointsCount: number = points != null ? points.points : 0;

    const [
      visitedLocationsCount,
      storylinesCompletedCount,
      trophiesEarnedCount,
    ] = await Promise.all([
      this.locationVisitRepository.count({accountId: user.accountId}),
      this.storylineParticipationRepository.count({
        accountId: user.accountId,
        dateCompleted: {neq: null},
      }),
      this.trophyRoomRepository.count({accountId: user.accountId}),
    ]);

    return {
      ...user,
      locationsVisitedCount: visitedLocationsCount.count,
      storylinesCompletedCount: storylinesCompletedCount.count,
      trophiesEarnedCount: trophiesEarnedCount.count,
      points: pointsCount,
    };
  }
}
