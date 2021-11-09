import BillRoutes from './bill.routes';
import AdminRoutes from './admin.routes';
import RoutesConfig from './routes-config';
import PaymentRoutes from './payment.routes';
import EmployeeRoutes from './employee.routes';
import AuthenticationRoutes from './authentication.routes';

export default class Routes {
  public static getRoutes(): RoutesConfig[] {
    return [
      new BillRoutes(),
      new AdminRoutes(),
      new PaymentRoutes(),
      new EmployeeRoutes(),
      new AuthenticationRoutes(),
    ];
  }
}
