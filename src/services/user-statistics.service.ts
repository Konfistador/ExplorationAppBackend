import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';
import {
  LeaderboardRepository,
  LocationVisitRepository,
  StorylineParticipationRepository,
  TrophyRoomRepository,
  UserAccountRepository,
} from '../repositories';
import {repository} from '@loopback/repository';

/*
 * Fix the service type. Possible options can be:
 * - import {UserStatistics} from 'your-module';
 * - export type UserStatistics = string;
 * - export interface UserStatistics {}
 */
export type UserStatistics = unknown;

@injectable({scope: BindingScope.TRANSIENT})
export class UserStatisticsProvider implements Provider<UserStatistics> {
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

  value() {
    // Add your implementation here
    throw new Error('To be implemented');
  }
}
