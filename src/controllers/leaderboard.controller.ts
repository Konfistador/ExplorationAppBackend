// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';

import {repository} from '@loopback/repository';
import {LeaderboardRepository, UserAccountRepository} from '../repositories';
import {get, getModelSchemaRef, HttpErrors} from '@loopback/rest';
import {Leaderboard} from '../models';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';

export class LeaderboardController {
  constructor(
    @repository(LeaderboardRepository)
    public leaderBoardRepository: LeaderboardRepository,
    @repository(UserAccountRepository)
    public userAccountRepository: UserAccountRepository,
  ) {}

  @get('/leaderboard', {
    responses: {
      '200': {
        description: 'Leaderboard, in sorted order 😎',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Leaderboard),
            },
          },
        },
      },
    },
  })
  async getLeaderboard(): Promise<Leaderboard[]> {
    const leaderboard = await this.leaderBoardRepository.find({
      include: [{relation: 'account'}],
      order: ['points DESC'],
    });

    if (leaderboard.length === 0) {
      throw new HttpErrors.NotFound('No user accounts in the DB');
    }

    return leaderboard;
  }

  @get('/leaderboard2', {
    responses: {
      '200': {
        description: 'Leaderboard, in sorted order 😎',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Leaderboard),
            },
          },
        },
      },
    },
  })
  async getLeaderboardWithNoPicture(): Promise<Object[]> {
    const leaderboard = await this.leaderBoardRepository.find({
      order: ['points DESC'],
    });

    if (leaderboard.length === 0) {
      throw new HttpErrors.NotFound('No user accounts in the DB');
    }

    const leaderboardWithName = await Promise.all(leaderboard.map(async object => {
      const username = await this.userAccountRepository.findById(
        object.accountId,
      );

      return {
        ...object,
        username: username.username,
      };
    }));

    for(let i = 0; i < leaderboardWithName.length; i++) {
      leaderboardWithName[i].id = i+1;
    }

    return leaderboardWithName;
  }

  @authenticate('jwt')
  @get('/user-account/points', {
    responses: {
      '200': {
        description: 'Points balance of the current user',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                pointsBalance: {
                  type: 'number',
                },
              },
            },
          },
        },
      },
    },
  })
  async getUserPoints(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Object> {
    const userAccount = await this.userAccountRepository.findById(
      Number(currentUserProfile[securityId]),
    );

    const leaderBoardEntries = await this.leaderBoardRepository.find({
      where: {
        accountId: userAccount.accountId,
      },
    });
    return {
      pointsBalance: leaderBoardEntries[0].points,
    };
  }
}
