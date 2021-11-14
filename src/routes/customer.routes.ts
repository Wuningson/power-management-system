import RoutesConfig from './routes-config';
import authenticateUser from '../middleware/authenticateUser';
import CustomerController from '../controllers/customer.controller';

export default class CustomerRoutes extends RoutesConfig {
  controller!: CustomerController;
  constructor() {
    super('CustomerRoutes');
  }

  initialize() {
    this.controller = new CustomerController();
  }

  configureRoutes() {
    this.router
      .route('/customer/:customerId')
      .get(
        authenticateUser,
        this.handleRequest(this.controller.fetchCustomerById)
      )
      .put(
        authenticateUser,
        this.handleRequest(this.controller.updateCustomerById)
      );

    this.router
      .route('/customer')
      .get(
        authenticateUser,
        this.handleRequest(this.controller.fetchCustomers)
      );

    return this.router;
  }
}
