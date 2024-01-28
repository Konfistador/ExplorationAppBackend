import {injectable,  BindingScope, Provider} from '@loopback/core';
import {UserAccount} from "../models";
import {repository} from "@loopback/repository";
import {LeaderboardRepository} from "../repositories";


export interface PointsService{
  updatePoints(userId:UserAccount, points: number): Promise<void>;
}

@injectable({scope: BindingScope.TRANSIENT})
export class PointsServiceProvider implements Provider<PointsService> {
  constructor(
      @repository(LeaderboardRepository)
      private leaderboardRepository: LeaderboardRepository,
  ) {}

  value() : PointsService {
  return {
    updatePoints: this.updatePoints.bind(this),
    };
  }

  async updatePoints(user: UserAccount, points: number): Promise<void> {
    await this.leaderboardRepository.updatePoints(user.accountId, points);
  }
}
