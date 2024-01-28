import {Entity, model, property} from '@loopback/repository';

@model()
export class LocationVisit extends Entity {

  @property({
    type: 'number',
    generated: true,
    id: true,
  })
  visitId: number;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'number',
  })
  accountId?: number
  @property({
    type: 'number',
  })
  locationId?: number

  constructor(data?: Partial<LocationVisit>) {
    super(data);
  }
}

export interface LocationVisitRelations {
  // describe navigational properties here
}

export type LocationVisitWithRelations = LocationVisit & LocationVisitRelations;
