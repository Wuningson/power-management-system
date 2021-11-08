import AdminRoutes from './admin.routes';
import RoutesConfig from './routes-config';
import EmployeeRoutes from './employee.routes';
import AuthenticationRoutes from './authentication.routes';
import BillRoutes from './bill.routes';

export default class Routes {
  public static getRoutes(): RoutesConfig[] {
    return [
      new AdminRoutes(),
      new AuthenticationRoutes(),
      new EmployeeRoutes(),
      new BillRoutes(),
    ];
  }
}
