import Controller from '../controllers/controller';
import { NextFunction, Request, Response, Router } from 'express';

type ControllerFunction = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<ControllerResult>;

export default abstract class RoutesConfig {
  name: string;
  router: Router;
  controller!: Controller;

  constructor(name: string) {
    this.name = name;
    this.initialize();
    this.router = Router();
  }

  handleRequest(controller: ControllerFunction) {
    return async function (req: Request, res: Response) {
      try {
        const { data, message } = await controller(req, res);
        const response = {
          data,
          message,
          status: true,
        };

        return res.status(200).json(response);
      } catch (err) {
        let response: ErrorResponse = {};
        response.name = 'INTERNAL_SERVER';
        response.status = false;

        let statusCode: ErrorHttpStatusCode = 500;

        if (err instanceof BaseError) {
          response.name = err.name;
          response.message = err.message;
          statusCode = err.httpCode;
        } else if (err instanceof Error) {
          response.message = err.message;
        } else {
          response.message = 'Something went wrong';
        }

        return res.status(statusCode).json(response);
      }
    };
  }

  initialize() {}

  abstract configureRoutes(): Router;
}
