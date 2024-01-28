import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where,} from '@loopback/repository';
import {del, get, getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody, response,} from '@loopback/rest';
import {Location, Storyline, StorylineLocation} from '../models';
import {LocationRepository, StorylineLocationRepository, StorylineRepository} from '../repositories';
import {NotificationService} from '../services';
import {service} from '@loopback/core';

export class StorylineController {
    constructor(
        @repository(StorylineRepository)
        public storylineRepository: StorylineRepository,
        @repository(LocationRepository)
        public locationRepository: LocationRepository,
        @repository(StorylineLocationRepository)
        public storylineLocationRepository: StorylineLocationRepository,
        @service(NotificationService)
        public notificationService: NotificationService,
    ) {
    }

    @post('/storylines')
    @response(200, {
        description: 'Storyline model instance',
        content: {'application/json': {schema: getModelSchemaRef(Storyline)}},
    })
    async create(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Storyline, {
                        title: 'NewStoryline',
                        exclude: ['storylineID'],
                    }),
                },
            },
        })
            storyline: Omit<Storyline, 'storylineID'>,
    ): Promise<Storyline> {
        await this.notificationService.notifyAllUsers(`We just added ${storyline.name}! Many interesting places inside!`);
        return this.storylineRepository.create(storyline);
    }

    @get('/storylines/count')
    @response(200, {
        description: 'Storyline model count',
        content: {'application/json': {schema: CountSchema}},
    })
    async count(
        @param.where(Storyline) where?: Where<Storyline>,
    ): Promise<Count> {
        return this.storylineRepository.count(where);
    }

    @get('/storylines')
    @response(200, {
        description: 'Array of Storyline model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: getModelSchemaRef(Storyline, {includeRelations: true}),
                },
            },
        },
    })
    async find(
        @param.filter(Storyline) filter?: Filter<Storyline>,
    ): Promise<Storyline[]> {
        return this.storylineRepository.find(filter);
    }

    @patch('/storylines')
    @response(200, {
        description: 'Storyline PATCH success count',
        content: {'application/json': {schema: CountSchema}},
    })
    async updateAll(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Storyline, {partial: true}),
                },
            },
        })
            storyline: Storyline,
        @param.where(Storyline) where?: Where<Storyline>,
    ): Promise<Count> {
        return this.storylineRepository.updateAll(storyline, where);
    }

    @get('/storylines/{id}')
    @response(200, {
        description: 'Storyline model instance',
        content: {
            'application/json': {
                schema: getModelSchemaRef(Storyline, {includeRelations: true}),
            },
        },
    })
    async findById(
        @param.path.number('id') id: number,
        @param.filter(Storyline, {exclude: 'where'}) filter?: FilterExcludingWhere<Storyline>
    ): Promise<Storyline> {
        return this.storylineRepository.findById(id, filter);
    }

    @patch('/storylines/{id}')
    @response(204, {
        description: 'Storyline PATCH success',
    })
    async updateById(
        @param.path.number('id') id: number,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Storyline, {partial: true}),
                },
            },
        })
            storyline: Storyline,
    ): Promise<void> {
        await this.storylineRepository.updateById(id, storyline);
    }

    @put('/storylines/{id}')
    @response(204, {
        description: 'Storyline PUT success',
    })
    async replaceById(
        @param.path.number('id') id: number,
        @requestBody() storyline: Storyline,
    ): Promise<void> {
        await this.storylineRepository.replaceById(id, storyline);
    }

    @del('/storylines/{id}')
    @response(204, {
        description: 'Storyline DELETE success',
    })
    async deleteById(@param.path.number('id') id: number): Promise<void> {
        await this.storylineRepository.deleteById(id);
    }

    @get('/storylines/{id}/locations')
    @response(200, {
        description: 'Array of Locations contained within the storyline',
        content: {'application/json': {schema: getModelSchemaRef(Location)}},
    })
    async findLocationsOfAStoryline(
        @param.path.number('id') storylineID: number,
    ): Promise<Location[]> {
        let storyline;

        try {
            storyline = await this.storylineRepository.findById(storylineID)
        } catch (err) {
            throw new HttpErrors.NotFound(`Storyline with id ${storylineID} not found!`)
        }

        const storylineLinks = await this.storylineLocationRepository.find({
            where: {storylineId: storyline.getId()},
        });
        if (storylineLinks.length == 0) {
            throw new HttpErrors.NotFound(`Storyline with id ${storylineID} does not have any linked locations`);
        }

        const locationIDs = storylineLinks
            .map(s1 => s1.locationId)
            .filter(id => id !== undefined);

        return await this.locationRepository.find({
            where: {
                id: {
                    inq: locationIDs,
                },
            },
        });
    }

    @patch('/storylines/{storylineID}/linkLocation/{locationID}')
    @response(204, {
        description: 'Storyline successfully linked',
    })

    async linkById(
        @param.path.number('storylineID') storylineID: number,
        @param.path.number('locationID') locationID: number,
    ): Promise<StorylineLocation> {

        let storyline;
        let location;

        try {
            storyline = await this.storylineRepository.findById(storylineID);
        } catch (err) {
            throw new HttpErrors.NotFound(`Storyline with id ${storylineID} does not exist. Did you forget to create one ?`)
        }
        try {
            location = await this.locationRepository.findById(locationID);
        } catch (err) {
            throw new HttpErrors.NotFound(`Location with id ${locationID} does not exist. Did you forget to create one ?`)
        }


        const existingLink = await this.storylineLocationRepository.findOne({
            where: {
                storylineId: storyline.storylineID,
                locationId: location.id,
            },
        });
        if (existingLink) {
            throw new HttpErrors.Conflict('Provided storyline and location are already linked');
        }

        const linkObj: Partial<StorylineLocation> = {
            storylineId: storyline.getId(),
            locationId: location.getId()
        };
        return this.storylineLocationRepository.create(linkObj);
    }

    @patch('storylines/{storylineID}/unlinkLocation/{locationID}')
    @response(204,{
        description: 'Location successfully unlinked!',
        content: {
            'text/plain': {
                schema : {
                    type: 'string',
                }
            }
        }
    })
    async unlinkById(
        @param.path.number('storylineID') storylineID: number,
        @param.path.number('locationID') locationID: number,
    ): Promise<void>{
        let link;

        try {
            link = await this.storylineLocationRepository.findOne({
                where: {
                    storylineId: storylineID,
                    locationId: locationID,
                },
            });
        } catch (err) {
            throw new HttpErrors.NotFound(`Link between Storyline with id ${storylineID} and Location with id ${locationID} does not exist`);
        }

        if(!link) {
            throw new HttpErrors.NotFound(`Link between Storyline with id ${storylineID} and Location with id ${locationID} does not exist`)
        }
        await this.storylineLocationRepository.deleteById(link.id);
    }
}
