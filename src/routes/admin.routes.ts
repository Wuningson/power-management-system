import RoutesConfig from './routes-config';
import AdminController from '../controllers/admin.controller';
import authenticateUser from '../middleware/authenticateUser';

export default class AdminRoutes extends RoutesConfig {
  controller!: AdminController;
  constructor() {
    super('AdminRoutes');
  }

  initialize() {
    this.controller = new AdminController();
  }

  configureRoutes() {
    this.router.post('/admin', this.handleRequest(this.controller.createAdmin));
    this.router.post(
      '/admin/employee',
      authenticateUser,
      this.handleRequest(this.controller.addNewEmployee)
    );

    return this.router;
  }
}
