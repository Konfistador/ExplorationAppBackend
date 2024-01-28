import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {Count, repository} from '@loopback/repository';
import {get, HttpErrors, param, patch, response} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {TrophyRoom, TrophyRoomRelations} from '../models';
import {TrophyRepository, TrophyRoomRepository, UserAccountRepository} from '../repositories';

@authenticate('jwt')
export class TrophyRoomController {
    constructor(
        @repository(TrophyRoomRepository)
        private trophyRoomRepository: TrophyRoomRepository,
        @repository(UserAccountRepository)
        private userAccountRepository: UserAccountRepository,
        @repository(TrophyRepository)
        private trophyRepository: TrophyRepository,
    ) {
    }

    @get('/trophy-room')
    async getAllTrophiesEarned(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<(Object)[]> {
        const user = await this.userAccountRepository.findById(Number(currentUserProfile[securityId]));
        const trophies = await this.trophyRoomRepository.find({
            where: {
                accountId: user.accountId
            },
            include: [{
                relation: 'trophy'
            }],
        });

        await Promise.all(trophies.map(async (trophyRoomEntry: TrophyRoom & TrophyRoomRelations) => {
            trophyRoomEntry.trophy = await this.trophyRepository.findById(trophyRoomEntry.trophyId);
        }));

        return trophies.map(
            ({accountId, trophyId, id, ...trophyRoomEntry}) => trophyRoomEntry
        );
    }

    @get('/trophy-room/count')
    async getAllTrophiesEarnedCount(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<Number> {
        const trophies: Count = await this.trophyRoomRepository.count({
            accountId: Number(currentUserProfile[securityId])
        })

        return trophies.count;
    }

    @patch('trophy-room/add')
    @response(204, {
        description: 'Trophy was awarded. Congratulations!',
        content: {
            'text/plain': {
                schema: {
                    type: 'string',
                }
            }
        }
    })
    async addTrophyToTrophyRoom(
        @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
        @param.query.number('trophyID') trophyID: number
    ): Promise<TrophyRoom> {
        const user = await this.userAccountRepository.findById(Number(currentUserProfile[securityId]));
        const trophy = await this.trophyRepository.findById(trophyID);

        const trophyRoomEntry = await this.trophyRoomRepository.findOne({
            where: {accountId: user.accountId, trophyId: trophyID}
        });

        if(trophyRoomEntry) {
            throw new HttpErrors.Conflict("This trophy has already been achieved!");
        }

        const dateFormatted: string = new Date().toString();
        return this.trophyRoomRepository.create({
            accountId: user.accountId,
            trophyId: trophy.trophyId,
            dateEarned: dateFormatted
        });
    }

}
