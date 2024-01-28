import {Entity, hasOne, model, property} from '@loopback/repository';
import {Trophy, TrophyWithRelations} from "./trophy.model";

@model()
export class TrophyRoom extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  dateEarned: string;

  @property({
    type: 'number',
  })
  accountId?: number;

  @property({
    type: 'number',
  })
  trophyId?: number;

  @hasOne(() => Trophy, {keyTo: 'trophyId'})
  trophy: Trophy;

  constructor(data?: Partial<TrophyRoom>) {
    super(data);
  }
}

export interface TrophyRoomRelations {
  // describe navigational properties here
  trophyRel?: TrophyWithRelations;

}

export type TrophyRoomWithRelations = TrophyRoom & TrophyRoomRelations;
