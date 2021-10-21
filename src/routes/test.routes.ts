import Test from '../controllers';
import RoutesConfig from './routes-config';

export default class TestRoute extends RoutesConfig {
  controller!: Test;
  constructor() {
    super('Test Route');
  }

  initialize() {
    this.controller = new Test();
  }

  configureRoutes() {
    this.router.post('/test', this.handleRequest(this.controller.test));
    return this.router;
  }
}
