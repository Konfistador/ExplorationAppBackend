import {
  Count,
  CountSchema,
  Where,
  repository
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {Trophy} from '../models/trophy.model';
import {TrophyRepository} from '../repositories';


export class TrophyController {
  constructor(
    @repository(TrophyRepository)
    private trophyRepository: TrophyRepository,
  ) { }

  @post('/trophy')
  @response(200, {
    description: 'Trophy model instance',
    content: {'application/json': {schema: getModelSchemaRef(Trophy)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trophy, {
            title: 'NewTrophy',
            exclude: ['trophyId'],
          }),
        },
      },
    })
    trophy: Omit<Trophy, 'id'>,
  ): Promise<Trophy> {
    return this.trophyRepository.create(trophy);
  }

  @get('/trophies')
  async getAllTrophies(): Promise<Trophy[]> {
    return this.trophyRepository.find();
  }

  @get('/trophies/count')
  @response(200, {
    description: 'Trophy model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.trophyRepository.count();
  }

  @del('/trophies/{trophyName}', {
    responses: {
      '204': {
        description: 'Trophy deleted',
      },
    },
  })
  async delete(
    @param.path.string('trophyName') trophyName: string,
  ): Promise<void> {
    const where: Where<Trophy> = {trophyName};
    await this.trophyRepository.deleteAll(where);
  }

}
