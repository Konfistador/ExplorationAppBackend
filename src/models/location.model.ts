import {Entity, model, property, hasMany} from '@loopback/repository';
import {LocationImage, LocationImageWithRelations} from './location-image.model';
import {Storyline} from './storyline.model';
import {StorylineLocation} from './storyline-location.model';
import {UserAccount, UserAccountWithRelations} from './user-account.model';
import {LocationVisit} from './location-visit.model';

@model({
  settings: {
    postgresql: {
      schema: 'public', table: 'location'
    }
  }
})
export class Location extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'locationID',
      dataType: 'serial',
    },
  })
  id: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    },
    postgresql: {
      columnName: 'name',
      dataType: 'text',
      nullable: 'NO'
    }
  })
  name: string;


    @property({
        type: 'string',
        required: true,
        postgresql: {
            columnName: 'longitude',
            dataType: 'text',
            nullable: 'NO'
        }
    })
    longitude: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'latitude',
      dataType: 'text',
      nullable: 'NO'
    }
  })
  latitude: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'description',
      dataType: 'text',
      nullable: 'NO'
    }
  })
  description: string;

  @hasMany(() => LocationImage, {keyTo: 'locationID'})
  locationImages?: LocationImage[];

  @hasMany(() => Storyline, {through: {model: () => StorylineLocation}})
  storylines: Storyline[];

  @hasMany(() => UserAccount, {through: {model: () => LocationVisit, keyTo: 'accountId'}})
  visitors: UserAccount[];

    constructor(data?: Partial<Location>) {
        super(data);
    }
}

export interface LocationRelations {
    // describe navigational properties here
    locationImages?: LocationImageWithRelations[];
    visitors?: UserAccountWithRelations[];
}

export type LocationWithRelations = Location & LocationRelations;
