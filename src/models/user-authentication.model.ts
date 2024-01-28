import {Entity, hasOne, model, property} from '@loopback/repository';
import {UserCredentials, UserAccount} from '../models';

@model()
export class UserAuthentication extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    jsonSchema: {
      format: 'email',
    },
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @hasOne(() => UserCredentials, {keyTo: 'userID'})
  userCredentials: UserCredentials;

  @hasOne(() => UserAccount, {keyTo: 'accountId'})
  userProfile: UserAccount;

  constructor(data?: Partial<UserAuthentication>) {
    super(data);
  }
}

export interface UserAuthenticationRelations {
  // describe navigational properties here
}

export type UserAuthenticationWithRelations = UserAuthentication &
  UserAuthenticationRelations;
