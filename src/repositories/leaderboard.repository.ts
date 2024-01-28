import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Leaderboard, LeaderboardRelations, UserAccount} from '../models';
import {UserAccountRepository} from './user-account.repository';

export class LeaderboardRepository extends DefaultCrudRepository<
    Leaderboard,
    typeof Leaderboard.prototype.id,
    LeaderboardRelations
> {

    public readonly account: BelongsToAccessor<UserAccount, typeof Leaderboard.prototype.id>;

    constructor(
        @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserAccountRepository') protected userAccountRepositoryGetter: Getter<UserAccountRepository>,
    ) {
        super(Leaderboard, dataSource);
        this.account = this.createBelongsToAccessorFor('account', userAccountRepositoryGetter,);
        this.registerInclusionResolver('account', this.account.inclusionResolver);
    }

    async updatePoints(accountId: number, points: number): Promise<void> {
        const leaderboardEntry = await this.findOne({where: {accountId: accountId}});
        if (leaderboardEntry instanceof Leaderboard) {
            leaderboardEntry.points += points;
            await this.update(leaderboardEntry);
        }
    }
}
