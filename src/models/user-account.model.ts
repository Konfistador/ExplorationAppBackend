import {Entity, hasMany, model, property} from '@loopback/repository';
import {LocationWithRelations, TrophyRoom, TrophyWithRelations} from '.';
import {Trophy} from './trophy.model';
import {Storyline} from './storyline.model';
import {StorylineParticipation} from './storyline-participation.model';
import {Location} from './location.model';
import {LocationVisit} from './location-visit.model';

@model()
export class UserAccount extends Entity {

  @property({
    type: 'number',
    id: true,
  })
  accountId: number;
  
  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  username: string;

  @property({
    type: 'string',
  })
  profilePicture: string;

  @property({
    type: 'string',
    required: true,
  })
  deviceToken: string;

  @hasMany(() => Trophy, {through: {model: () => TrophyRoom, keyFrom: 'accountId'}})
  trophies: Trophy[];

  @hasMany(() => Storyline, {through: {model: () => StorylineParticipation, keyFrom: 'accountId', keyTo: 'storylineID'}})
  storylines: Storyline[];

  @hasMany(() => Location, {through: {model: () => LocationVisit, keyFrom: 'accountId'}})
  locationsVisited: Location[];

  constructor(data?: Partial<UserAccount>) {
    super(data);
  }
}

export interface UserAccountRelations {
  // describe navigational properties here
  trophies?: TrophyWithRelations[];
  locationsVisited?: LocationWithRelations[];
}

export type UserAccountWithRelations = UserAccount & UserAccountRelations;
