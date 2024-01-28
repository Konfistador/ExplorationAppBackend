import {Entity, model, property} from '@loopback/repository';

@model()
export class ScheduledNotification extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  deviceToken: string;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'date',
    required: true,
  })
  sendAt: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  sent: boolean;


  constructor(data?: Partial<ScheduledNotification>) {
    super(data);
  }
}

export interface ScheduledNotificationRelations {
  // describe navigational properties here
}

export type ScheduledNotificationWithRelations = ScheduledNotification & ScheduledNotificationRelations;
