import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Count, repository} from '@loopback/repository';
import {HttpErrors, get, getModelSchemaRef, param, post} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {Storyline, StorylineParticipation} from '../models';
import {
  LocationVisitRepository,
  StorylineLocationRepository,
  StorylineParticipationRepository,
  StorylineRepository,
  UserAccountRepository,
} from '../repositories';

@authenticate('jwt')
export class StorylineParticipationController {
  constructor(
    @repository(UserAccountRepository)
    protected userAccountRepository: UserAccountRepository,
    @repository(StorylineParticipationRepository)
    protected storylineParticipationRepository: StorylineParticipationRepository,
    @repository(StorylineRepository)
    protected storylineRepository: StorylineRepository,
    @repository(LocationVisitRepository)
    protected locationVisitRepository: LocationVisitRepository,
    @repository(StorylineLocationRepository)
    protected storylineLocationRepository: StorylineLocationRepository,
  ) {}

  @get('/user-account/startedStorylines', {
    responses: {
      '200': {
        description: 'Returns all started storylines for the logged user.',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Storyline)},
          },
        },
      },
    },
  })
  async getAllStartedStorylinesForUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Storyline[]> {
    return this.userAccountRepository
      .storylines(Number(currentUserProfile[securityId]))
      .find();
  }

  @get('/user-account/startedStorylines/count', {
    responses: {
      '200': {
        description: 'Returns all started storylines for the logged user.',
        content: {
          'application/json': {
            schema: {object: {count: 0}},
          },
        },
      },
    },
  })
  async getStartedStorylinesCountForUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Number> {
    const storylines: Count = await this.storylineParticipationRepository.count(
      {
        accountId: Number(currentUserProfile[securityId]),
        dateCompleted: {neq: null},
      },
    );

    return storylines.count;
  }

  @get('/user-account/completedStorylines', {
    responses: {
      '200': {
        description: 'Returns all completed storylines for the logged user.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(StorylineParticipation),
            },
          },
        },
      },
    },
  })
  async getAllCompletedStorylinesForUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Object[]> {
    const accountId: number = Number(currentUserProfile[securityId]);

    const completedStorylinesId =
      await this.storylineParticipationRepository.find({
        where: {accountId: accountId, dateCompleted: {neq: null}},
      });

    const storylinesList: Promise<Object>[] = completedStorylinesId.map(
      async storylineParticipation => {
        let storyline = await this.storylineRepository.findById(
          storylineParticipation.storylineID,
        );

        return {
          storylineParticipationId: storylineParticipation.id,
          accountId: storylineParticipation.accountId,
          dateStarted: storylineParticipation.dateStarted,
          dateCompleted: storylineParticipation.dateCompleted,
          storyline: storyline,
        };
      },
    );

    const resolvedStorylinesList: Object[] = await Promise.all(storylinesList);

    return resolvedStorylinesList;
  }

  @post('/user-account/beginStoryline/{storylineId}', {
    responses: {
      '200': {
        description: 'Begin a storyline for the logged user.',
        content: {'application/json': {schema: getModelSchemaRef(Storyline)}},
      },
    },
  })
  async beginStoryline(
    @param.path.number('storylineId') storylineId: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<StorylineParticipation> {
    const foundStorylineWithID = await this.storylineRepository.find({
      where: {
        storylineID: storylineId,
      },
    });

    if (foundStorylineWithID.length == 0) {
      throw new HttpErrors.BadRequest(
        `Storyline with storylineID ${storylineId} does not exist.`,
      );
    }

    const accountId: number = Number(currentUserProfile[securityId]);

    let foundStoryParticipationWithID =
      await this.storylineParticipationRepository.find({
        where: {accountId: accountId, storylineID: storylineId},
      });

    if (foundStoryParticipationWithID.length > 0) {
      throw new HttpErrors.BadRequest(
        'This storyline has already been started.',
      );
    }

    const dateFormatted: string = new Date().toString();

    const storylineParticipationObject: Partial<StorylineParticipation> = {
      accountId: accountId,
      storylineID: storylineId,
      dateStarted: dateFormatted,
    };

    if (await this.checkVisitedAllLocations(accountId, storylineId)) {
      storylineParticipationObject.dateCompleted = dateFormatted;
    }

    return this.storylineParticipationRepository.create(
      storylineParticipationObject,
    );
  }

  async checkVisitedAllLocations(
    accountId: number,
    storylineId: number,
  ): Promise<Boolean> {
    const allStorylineLocationIds: number[] = (
      await this.storylineLocationRepository.find({
        where: {
          storylineId: storylineId,
        },
      })
    ).map(storylineLocation => storylineLocation.locationId);

    const allVisitedByUserLocationIds: number[] = (
      await this.locationVisitRepository.find({where: {accountId: accountId}})
    ).map(locationVisits => locationVisits.locationId!);

    return allStorylineLocationIds.every(storylineLocation =>
      allVisitedByUserLocationIds.includes(storylineLocation),
    );
  }
}
