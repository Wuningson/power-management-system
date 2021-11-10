import BillRoutes from './bill.routes';
import AdminRoutes from './admin.routes';
import RoutesConfig from './routes-config';
import PaymentRoutes from './payment.routes';
import EmployeeRoutes from './employee.routes';
import AuthenticationRoutes from './authentication.routes';
import CustomerRoutes from './customer.routes';

export default class Routes {
  public static getRoutes(): RoutesConfig[] {
    return [
      new BillRoutes(),
      new AdminRoutes(),
      new PaymentRoutes(),
      new EmployeeRoutes(),
      new CustomerRoutes(),
      new AuthenticationRoutes(),
    ];
  }
}
