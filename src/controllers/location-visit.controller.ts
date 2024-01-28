import {inject, service} from '@loopback/core';

import {authenticate} from '@loopback/authentication';
import {Count, repository} from '@loopback/repository';
import {HttpErrors, get, getModelSchemaRef, param, patch} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {LocationVisit, UserAccount} from '../models';
import {
  LocationRepository,
  LocationVisitRepository,
  StorylineLocationRepository,
  StorylineParticipationRepository,
  LeaderboardRepository,
  UserAccountRepository,
} from '../repositories';
import {PointsService, PointsServiceProvider} from "../services";

export interface LocationVisitResponse {
  visitId: number;
  date: string;
}

@authenticate('jwt')
export class LocationVisitController {
  constructor(
    @repository(LocationVisitRepository)
    public locationVisitRepository: LocationVisitRepository,
    @repository(UserAccountRepository)
    public userAccountRepository: UserAccountRepository,
    @repository(LocationRepository)
    public locationRepository: LocationRepository,
    @repository(StorylineLocationRepository)
    protected storylineLocationRepository: StorylineLocationRepository,
    @repository(StorylineParticipationRepository)
    protected storylineParticipationRepository: StorylineParticipationRepository,
    @repository(LeaderboardRepository)
    public leaderBoardRepository: LeaderboardRepository,
    @service(PointsServiceProvider)
    public pointsService: PointsService
  ) {}

  @get('/user-account/visits', {
    responses: {
      '200': {
        description:
          'Array of Visited location for the current + the date of their visit',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LocationVisit)},
          },
        },
      },
    },
  })
  async findUserVisitedLocations(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Object[]> {
    const user = await this.userAccountRepository.findById(
      Number(currentUserProfile[securityId]),
    );
    const visitedLocations = await this.userAccountRepository
      .locationsVisited(user.accountId)
      .find();
    if (visitedLocations.length === 0) {
      throw new HttpErrors.NotFound(
        `User with id ${user.accountId} has no visited locations`,
      );
    }

    const visits = await this.locationVisitRepository.find({
      where: {accountId: user.accountId},
    });

    return visitedLocations.map(location => {
      const visit = visits.find(v => v.locationId === location.id);
      return {
        ...location,
        date: visit?.date,
      };
    });
  }

  @get('/user-account/visits/count', {
    responses: {
      '200': {}
    },
  })
  async findUserVisitedLocationsCount(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Number> {
    const visitedLocations: Count = await this.locationVisitRepository.count({
      accountId: Number(currentUserProfile[securityId])
    });

    return visitedLocations.count;
  }

  @get('/locations/{id}/visitors', {
    responses: {
      '200': {
        description:
          'Array of User that have visited the location + their location date',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserAccount)},
          },
        },
      },
    },
  })
  async findLocationVisitors(
    @param.path.number('id') locationID: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Object[]> {
    const user = await this.userAccountRepository.findById(
      Number(currentUserProfile[securityId]),
    );
    const visitors = await this.locationRepository
      .visitors(user.accountId)
      .find();

    if (visitors.length === 0) {
      throw new HttpErrors.NotFound(
        `Location with id ${locationID} has no visitors`,
      );
    }

    const visits = await this.locationVisitRepository.find({
      where: {locationId: locationID},
    });

    return visitors.map(visitor => {
      const visit = visits.find(v => v.accountId === visitor.accountId);
      return {
        ...visitor,
        date: visit?.date,
      };
    });
  }

  @patch('/locations/visit/{id}', {
    responses: {
      '200': {
        description: 'A new Visit was created!',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                visitDate: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The date the visit occurred',
                },
              },
            },
          },
        },
      },
    },
  })
  async visitLocation(
    @param.path.number('id')
    locationId: typeof LocationVisit.prototype.locationId,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Object> {
    const accountId = Number(currentUserProfile[securityId]);
    const visitDate = new Date();

    const locationRecord = await this.locationRepository.findById(
      Number(locationId),
    );

    if (locationRecord == null) {
      throw new HttpErrors.NotFound(
        `Location with id ${locationId} does not exist`,
      );
    }

    const existingVisit = await this.locationVisitRepository.findOne({
      where: {accountId: accountId, locationId: locationId},
    });

    if (existingVisit) {
      throw new HttpErrors.Conflict('User has already visited the location');
    }

    await this.locationVisitRepository.create({
      accountId,
      locationId,
      date: visitDate.toString(),
    });

    const allStorylinesContainingLocationIds: number[] = (
      await this.storylineLocationRepository.find({
        where: {
          locationId: locationId,
        },
      })
    ).map(storyline => storyline.storylineId);

    allStorylinesContainingLocationIds.forEach(async storylineId => {
      const foundStoryParticipationWithID =
        await this.storylineParticipationRepository.findOne({
          where: {
            accountId: accountId,
            storylineID: storylineId,
          },
        });

      if (foundStoryParticipationWithID == null) return;

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

      if (
        allStorylineLocationIds.every(storylineLocation =>
          allVisitedByUserLocationIds.includes(storylineLocation),
        )
      ) {
        await this.storylineParticipationRepository.updateById(
          foundStoryParticipationWithID.id,
          {
            dateCompleted: visitDate.toString(),
          },
        );
      }

      return;
    });

    const userAccount = await this.userAccountRepository.findById(accountId);

    await this.pointsService.updatePoints(userAccount,5);

    return {
      visitDate: visitDate,
    };
  }
}
