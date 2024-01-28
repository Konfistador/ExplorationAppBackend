import {Entity, model, property} from '@loopback/repository';

@model()
export class StorylineParticipation extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  accountId: number;

  @property({
    type: 'number',
    required: true,
  })
  storylineID: number;

  @property({
    type: 'date',
    required: true,
  })
  dateStarted: string;

  @property({
    type: 'date',
  })
  dateCompleted?: string | null;

  constructor(data?: Partial<StorylineParticipation>) {
    super(data);
  }
}

export interface StorylineParticipationRelations {
  // describe navigational properties here
}

export type StorylineParticipationWithRelations = StorylineParticipation & StorylineParticipationRelations;
