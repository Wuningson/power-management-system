import express, { Application } from 'express';

export default class App {
  private port: number;
  public app: Application;
  public apiPath: string;
  constructor(port: number, apiPath: string) {
    this.port = port;
    this.app = express();
    this.apiPath = apiPath;
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
