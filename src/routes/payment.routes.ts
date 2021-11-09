import RoutesConfig from './routes-config';
import PaymentController from '../controllers/payment.controller';
import authenticateUser from '../middleware/authenticateUser';

export default class PaymentRoutes extends RoutesConfig {
  controller!: PaymentController;
  constructor() {
    super('Payment');
  }

  configureRoutes() {
    this.router
      .route('/payment')
      .post(
        authenticateUser,
        this.handleRequest(this.controller.generatePaymentLink)
      )
      .get(this.handleRequest(this.controller.fetchUserPayments));

    this.router.post(
      '/webhook',
      this.handleRequest(this.controller.paymentWebhook)
    );

    this.router.get(
      '/callback',
      this.handleRequest(this.controller.paymentCallback)
    );
    return this.router;
  }

  initialize() {
    this.controller = new PaymentController();
  }
}
