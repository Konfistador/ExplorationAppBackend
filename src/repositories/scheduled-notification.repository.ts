import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ScheduledNotification, ScheduledNotificationRelations} from '../models';

export class ScheduledNotificationRepository extends DefaultCrudRepository<
  ScheduledNotification,
  typeof ScheduledNotification.prototype.id,
  ScheduledNotificationRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ScheduledNotification, dataSource);
  }
}
