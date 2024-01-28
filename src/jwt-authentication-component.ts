import {registerAuthenticationStrategy} from '@loopback/authentication';
import {
  Application,
  Binding,
  Component,
  CoreBindings,
  createBindingFromClass,
  inject,
} from '@loopback/core';
import {
  TokenServiceBindings,
  TokenServiceConstants,
  UserAuthenticationServiceBindings,
} from './keys';
import {
  UserCredentialsRepository,
  UserAuthenticationRepository,
} from './repositories';
import {UserAuthenticationService} from './services';
import {JWTAuthenticationStrategy} from './services/jwt.auth.strategy';
import {JWTService} from './services/jwt.service';
import {SecuritySpecEnhancer} from './services/security.spec.enhancer';

export class JWTAuthenticationComponent implements Component {
  bindings: Binding[] = [
    Binding.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    ),
    Binding.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService),

    Binding.bind(UserAuthenticationServiceBindings.USER_SERVICE).toClass(UserAuthenticationService),
    Binding.bind(UserAuthenticationServiceBindings.USER_REPOSITORY).toClass(UserAuthenticationRepository),
    Binding.bind(UserAuthenticationServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      UserCredentialsRepository,
    ),
    createBindingFromClass(SecuritySpecEnhancer),
  ];
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application) {
    registerAuthenticationStrategy(app, JWTAuthenticationStrategy);
  }
}
