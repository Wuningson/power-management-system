import RoutesConfig from './routes-config';
import AuthenticationController from '../controllers/authentication.controller';

export default class AuthenticationRoutes extends RoutesConfig {
  controller!: AuthenticationController;
  constructor() {
    super('AuthenticationRoutes');
  }

  initialize() {
    this.controller = new AuthenticationController();
  }

  configureRoutes() {
    this.router.post('/login', this.handleRequest(this.controller.userLogin));

    return this.router;
  }
}
