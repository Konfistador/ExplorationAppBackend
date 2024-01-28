import {Entity, model, property, belongsTo} from '@loopback/repository';
import {UserAccount} from './user-account.model';

@model()
export class Leaderboard extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    default: 0,
  })
  points: number;

  @belongsTo(() => UserAccount)
  accountId: number;

  constructor(data?: Partial<Leaderboard>) {
    super(data);
  }
}

export interface LeaderboardRelations {
  // describe navigational properties here
}

export type LeaderboardWithRelations = Leaderboard & LeaderboardRelations;
