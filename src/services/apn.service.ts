import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import * as apn from 'apn';

@injectable({scope: BindingScope.SINGLETON})
export class ApnService {
  private provider: apn.Provider;
  constructor() {
    const options = {
      token: {
        key: 'trunk/AuthKey_R9L5726VKR.p8',
        keyId: 'R9L5726VKR',
        teamId: 'KH7BD93PMV',
      },
      production: false,
    };
    this.provider = new apn.Provider(options);
  }

  /*
   * Add service methods here
   */
  async send (notification: apn.Notification, deviceToken: string){
    const result = await this.provider.send(notification, deviceToken);
    if( result.failed.length > 0) {
      const err = result.failed[0].error;
      if(err) {
        console.error('FAILED! APN Service Notification Failure');
      }
    }
    return result;
  }
}
