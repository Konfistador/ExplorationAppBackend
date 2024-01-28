import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response, HttpErrors,
} from '@loopback/rest';
import {Location, Storyline} from '../models';
import {LocationRepository} from '../repositories';
import {NotificationService} from '../services';
import {service} from '@loopback/core';


export class LocationController {
  constructor(
      @repository(LocationRepository)
      public locationRepository: LocationRepository,
      @service(NotificationService)
      public notificationService: NotificationService,
  ) {
  }

  @post('/locations')
  @response(200, {
    description: 'Location model instance',
    content: {'application/json': {schema: getModelSchemaRef(Location)}},
  })
  async create(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Location, {
              title: 'NewLocation',
              exclude: ['id'],
            }),
          },
        },
      })
          location: Omit<Location, 'id'>,
  ): Promise<Location> {

    let locationRecord;

    try {
      locationRecord = await this.locationRepository.create(location);
    } catch (err) {
      throw new HttpErrors.Conflict("Location already exists!");
    }

    await this.notificationService.notifyAllUsers(`New location added: ${location.name}. Go and check it out!`);

    return locationRecord;
  }

  @get('/locations/count')
  @response(200, {
    description: 'Location model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
      @param.where(Location) where?: Where<Location>,
  ): Promise<Count> {
    return this.locationRepository.count(where);
  }

  @get('/locations')
  @response(200, {
    description: 'Array of Location model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Location, {includeRelations: true}),
        },
      },
    },
  })
  async find(
      @param.filter(Location) filter?: Filter<Location>,
  ): Promise<Location[]> {
    return this.locationRepository.find(filter);
  }

  @patch('/locations')
  @response(200, {
    description: 'Location PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Location, {partial: true}),
          },
        },
      })
          location: Location,
      @param.where(Location) where?: Where<Location>,
  ): Promise<Count> {
    return this.locationRepository.updateAll(location, where);
  }

  @get('/locations/{id}')
  @response(200, {
    description: 'Location model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Location, {includeRelations: true}),
      },
    },
  })
  async findById(
      @param.path.number('id') id: number,
      @param.filter(Location, {exclude: 'where'}) filter?: FilterExcludingWhere<Location>
  ): Promise<Location> {
    return this.locationRepository.findById(id, filter);
  }

  @get('/locations/{id}/storylines')
  @response(200, {
    description: 'Storylines, with current location participation',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Location, {includeRelations: true}),
      },
    },
  })
  async findAllStorylinesOfLocationWithID(
      @param.path.number('id') id: number,
      @param.filter(Location, {exclude: 'where'}) filter?: FilterExcludingWhere<Location>
  ): Promise<Location> {
    return this.locationRepository.findById(id, {include: ['storylines']});
    //return this.locationRepository.find({include: ['storylines']});
  }

  @patch('/locations/{id}')
  @response(204, {
    description: 'Location PATCH success',
  })
  async updateById(
      @param.path.number('id') id: number,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Location, {partial: true}),
          },
        },
      })
          location: Location,
  ): Promise<void> {
    await this.locationRepository.updateById(id, location);
  }

  @put('/locations/{id}')
  @response(204, {
    description: 'Location PUT success',
  })
  async replaceById(
      @param.path.number('id') id: number,
      @requestBody() location: Location,
  ): Promise<void> {
    await this.locationRepository.replaceById(id, location);
  }

  @del('/locations/{id}')
  @response(204, {
    description: 'Location DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.locationRepository.deleteById(id);
  }

  @get('/locations/{id}/storylines', {
    responses: {
      '200': {
        description: 'Array of Storylines in which the given location participates',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Storyline)},
          },
        },
      },
    },
  })
  async findStorylinesWithLocation(
      @param.path.number('id') id: number,
      @param.query.object('filter') filter?: Filter<Storyline>,
  ): Promise<Storyline[]> {
    return this.locationRepository.storylines(id).find(filter);
  }

  @get('/locations/nearby')
  @response(200, {
    description: 'Array of nearby Location model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Location, {includeRelations: true}),
        },
      },
    },
  })
  async getLocationsNearby(
      @param.query.string('latitude') latitude: string,
      @param.query.string('longitude') longitude: string,
      @param.query.number('radius(m)') radius: number,
  ): Promise<Location[]> {
    return this.locationRepository.findNearbyLocations(latitude, longitude, radius);
  }
}
