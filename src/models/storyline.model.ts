import {Entity, model, property, hasMany} from '@loopback/repository';
import {Location} from './location.model';
import {StorylineLocation} from './storyline-location.model';

@model()
export class Storyline extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  storylineID?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    default: 'Very cool storyline',
  })
  description?: string;

  @hasMany(() => Location, {through: {model: () => StorylineLocation}})
  locations: Location[];
  // @hasMany(() => Location)
  // locations: Location[];

  constructor(data?: Partial<Storyline>) {
    super(data);
  }
}

export interface StorylineRelations {
  // describe navigational properties here
  locations?: StorylineWithRelations[];
}

export type StorylineWithRelations = Storyline & StorylineRelations;
