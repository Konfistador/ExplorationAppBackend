import {Entity, model, property} from '@loopback/repository';

@model()
export class UserCredentials extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  userID: number;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  // describe navigational properties here
}

export type UserCredentialsWithRelations = UserCredentials & UserCredentialsRelations;
