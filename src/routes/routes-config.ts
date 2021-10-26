import { handleError } from '../global/error';
import Controller from '../controllers/controller';
import { NextFunction, Request, Response, Router } from 'express';

type ControllerFunction = (req: Request) => Promise<ControllerResult>;

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
    return async (req: Request, res: Response) => {
      try {
        const { data, message } = await controller(req);
        const response = {
          data,
          message,
          status: true,
        };

        return res.status(200).json(response);
      } catch (err) {
        console.log(err);
        const { statusCode, response } = handleError(err);

        return res.status(statusCode).json(response);
      }
    };
  }

  abstract initialize(): void;

  abstract configureRoutes(): Router;
}
