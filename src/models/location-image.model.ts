import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Location, LocationWithRelations} from './location.model';

@model({
  settings: {
    postgresql: {
      schema: 'public', table: 'locationImage'
    },
    foreignKeys: {
      name: 'fk_locationImage_location',
      entity: 'Location',
      entityKey: 'id',
      foreignKey: 'location',
    },
  },
})
export class LocationImage extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'id',
      dataType: 'serial',
    }
  })
  id: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'value',
      dataType: 'text',
      nullable: 'NO'
    }
  })
  value: string;

  // @property({
  //   type: 'number',
  //   required: true,
  //   postgresql: {
  //     columnName: 'locationID',
  //     dataType: 'numeric'
  //   }
  // })
  // locationID: number;

  @belongsTo(() => Location)
  locationId: number;

  constructor(data?: Partial<LocationImage>) {
    super(data);

  }
}

export interface LocationImageRelations {
  // describe navigational properties here
  locationId?: LocationWithRelations;
}

export type LocationImageWithRelations = LocationImage & LocationImageRelations;
