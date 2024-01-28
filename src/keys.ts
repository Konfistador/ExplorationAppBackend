import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {UserAuthentication} from './models';
import {Credentials} from './services/user-authentication.service';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '21600';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace UserAuthenticationServiceBindings {
  export const USER_SERVICE = BindingKey.create<
    UserService<UserAuthentication, Credentials>
    // Not sure about case
  >('services.UserAuthenticationService');
  export const DATASOURCE_NAME = 'db';
  export const USER_REPOSITORY = 'repositories.UserAuthenticationRepository';
  export const USER_CREDENTIALS_REPOSITORY =
    'repositories.UserCredentialsRepository';
}
