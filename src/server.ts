import cors from 'cors';
import App from './app';
import morgan from 'morgan';
import helmet from 'helmet';
import Routes from './routes';
import { json } from 'express';
import Database from './config/database';
import getEnvVariables from './config/env';

const { port, apiPath } = getEnvVariables();

new Database().connect();

const app = new App(port, apiPath!, Routes.getRoutes());
const expressApp = app.getApp();

expressApp.use(cors());
expressApp.use(json());
expressApp.use(helmet());
expressApp.use(morgan('dev'));

app.configureRoutes();

app.listen();
