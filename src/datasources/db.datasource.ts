import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'db',
  connector: 'postgresql',
  url: 'postgres://db_2023_prj4_ios_group8_db_user:vjYzjEDb0ArbTpFHsXTkziCSQ2za0fag@dpg-chdo6nqk728nnn1gnt90-a.frankfurt-postgres.render.com:5432/db_2023_prj4_ios_group8_db?ssl=true'
  // url: 'postgres://postgres:mypassword@localhost:5432'
  // url: 'postgres://postgres:mypassword@localhost:32768'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
