import { Application } from 'express';
import TestRoute from './test.routes';

export default class Routes {
  public static setRoutes(app: Application, apiPath: string) {
    app.use(apiPath, new TestRoute().configureRoutes());
  }
}
