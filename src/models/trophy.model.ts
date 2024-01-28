import {Entity, model, property} from '@loopback/repository';

@model()
export class Trophy extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'trophyId',
      dataType: 'serial',
    }
  })
  trophyId?: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'trophyName',
      dataType: 'text',
    }
  })
  trophyName: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'trophyDescription',
      dataType: 'text',
    }
  })
  trophyDescription: string;

  constructor(data?: Partial<Trophy>) {
    super(data);
  }
}

export interface TrophyRelations {
  // describe navigational properties here

}

export type TrophyWithRelations = Trophy & TrophyRelations;
