import RoutesConfig from './routes-config';
import PaymentController from '../controllers/payment.controller';
import authenticateUser from '../middleware/authenticateUser';

export default class PaymentRoutes extends RoutesConfig {
  controller!: PaymentController;
  constructor() {
    super('Payment');
  }

  configureRoutes() {
    this.router.post(
      '/payment',
      authenticateUser,
      this.handleRequest(this.controller.generatePaymentLink)
    );

    this.router.post(
      '/callback',
      this.handleRequest(this.controller.paymentCallback)
    );

    this.router.get('/test', this.handleRequest(this.controller.test));
    return this.router;
  }

  initialize() {
    this.controller = new PaymentController();
  }
}
