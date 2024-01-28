import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Location,
  LocationImage,
} from '../models';
import {LocationImageRepository, LocationRepository} from '../repositories';

export class LocationImageController {
  constructor(
    @repository(LocationRepository) protected locationRepository: LocationRepository,
    @repository(LocationImageRepository) protected locationImageRepository: LocationImageRepository,
  ) { }

  @get('/locations/{id}/location-images', {
    responses: {
      '200': {
        description: 'Array of Location has many LocationImage',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LocationImage)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<LocationImage>,
  ): Promise<LocationImage[]> {
    return this.locationRepository.locationImages(id).find(filter);
  }

  @post('/locations/{id}/location-images', {
    responses: {
      '200': {
        description: 'Location model instance',
        content: {'application/json': {schema: getModelSchemaRef(LocationImage)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Location.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LocationImage, {
            title: 'NewLocationImageInLocation',
            exclude: ['id'],
          }),
        },
      },
    }) locationImage: Omit<LocationImage, 'id'>,
  ): Promise<LocationImage> {
    return this.locationRepository.locationImages(id).create(locationImage);
  }

  @patch('/locations/{id}/location-images', {
    responses: {
      '200': {
        description: 'Location.LocationImage PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LocationImage, {partial: true}),
        },
      },
    })
    locationImage: Partial<LocationImage>,
    @param.query.object('where', getWhereSchemaFor(LocationImage)) where?: Where<LocationImage>,
  ): Promise<Count> {
    return this.locationRepository.locationImages(id).patch(locationImage, where);
  }

  @del('/locations/{id}/location-images', {
    responses: {
      '200': {
        description: 'Location.LocationImage DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(LocationImage)) where?: Where<LocationImage>,
  ): Promise<Count> {
    return this.locationRepository.locationImages(id).delete(where);
  }
  @get('/location-images/{id}/location', {
    responses: {
      '200': {
        description: 'Location belonging to LocationImage',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Location),
          },
        },
      },
    },
  })
  async getLocation(
      @param.path.number('id') id: typeof LocationImage.prototype.id,
  ): Promise<Location> {
    return this.locationImageRepository.location(id);
  }
}
