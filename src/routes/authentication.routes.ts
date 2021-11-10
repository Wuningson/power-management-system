import RoutesConfig from './routes-config';
import authenticateUser from '../middleware/authenticateUser';
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
    this.router
      .route('/auth')
      .post(this.handleRequest(this.controller.userLogin))
      .get(
        authenticateUser,
        this.handleRequest(this.controller.fetchAuthenticatedUser)
      );

    return this.router;
  }
}
