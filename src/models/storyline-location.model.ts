import {Entity, model, property} from '@loopback/repository';

@model()
export class StorylineLocation extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  storylineId: number;

  @property({
    type: 'number',
  })
  locationId: number;

  constructor(data?: Partial<StorylineLocation>) {
    super(data);
  }
}

export interface StorylineLocationRelations {
  // describe navigational properties here
}

export type StorylineLocationWithRelations = StorylineLocation & StorylineLocationRelations;
