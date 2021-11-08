import RoutesConfig from './routes-config';
import BillController from '../controllers/bill.controller';
import authenticateUser from '../middleware/authenticateUser';

export default class BillRoutes extends RoutesConfig {
  controller!: BillController;
  constructor() {
    super('BillRoutes');
  }

  initialize() {
    this.controller = new BillController();
  }

  configureRoutes() {
    this.router
      .route('/bill')
      .all(authenticateUser)
      .post(this.handleRequest(this.controller.addCustomerBill))
      .get(this.handleRequest(this.controller.fetchCustomerBills));

    this.router
      .route('/bill/:billId')
      .all(authenticateUser)
      .get(this.handleRequest(this.controller.fetchBillById))
      .put(this.handleRequest(this.controller.updateBillById));

    return this.router;
  }
}
