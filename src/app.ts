import express, { Application } from 'express';
import RoutesConfig from './routes/routes-config';

export default class App {
  private port: number;
  public app: Application;
  public apiPath: string;
  public routes: RoutesConfig[];

  constructor(port: number, apiPath: string, routes: RoutesConfig[]) {
    this.port = port;
    this.app = express();
    this.apiPath = apiPath;
    this.routes = routes;
  }

  public configureRoutes() {
    return this.routes.forEach(route => {
      this.app.use(this.apiPath, route.configureRoutes());
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App is listening on port ${this.port}`);
    });
  }

  public getApp() {
    return this.app;
  }
}
