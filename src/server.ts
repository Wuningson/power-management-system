import cors from 'cors';
import App from './app';
import morgan from 'morgan';
import helmet from 'helmet';
import Routes from './routes';
import { json } from 'express';
import Database from './config/database';
import getEnvVariables from './config/env';

const { port, apiPath, databaseUrl } = getEnvVariables();

new Database(databaseUrl).connect();

const app = new App(port, apiPath!);
const expressApp = app.getApp();

expressApp.use(cors());
expressApp.use(json());
expressApp.use(helmet());
expressApp.use(morgan('dev'));
Routes.setRoutes(expressApp, '/api');

app.listen();
