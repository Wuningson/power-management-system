import RoutesConfig from './routes-config';
import EmployeeController from '../controllers/employee.controller';
import authenticateUser from '../middleware/authenticateUser';

export default class EmployeeRoutes extends RoutesConfig {
  controller!: EmployeeController;
  constructor() {
    super('Employee');
  }

  configureRoutes() {
    this.router.post(
      '/employee/customer',
      authenticateUser,
      this.handleRequest(this.controller.addNewCustomer)
    );

    this.router.get(
      '/employee/dashboard',
      authenticateUser,
      this.handleRequest(this.controller.fetchDashboardData)
    );

    this.router.get(
      '/employee/:employeeId',
      authenticateUser,
      this.handleRequest(this.controller.fetchEmployeeById)
    );

    return this.router;
  }

  initialize() {
    this.controller = new EmployeeController();
  }
}
