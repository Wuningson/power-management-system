import { Request, Response } from 'express';
import Controller from './controller';

export default class Test extends Controller {
  constructor() {
    super('test');
  }
  async test(req: Request, res: Response): Promise<ControllerResult> {
    console.log(req);
    console.log(res);
    return {
      data: null,
      message: 'This was nice',
    };
  }
}
