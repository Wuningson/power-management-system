import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import Controller from './controller';
import BaseError from '../global/error';
import getEnvVariables from '../config/env';
import { AdminModel, CustomerModel, EmployeeModel } from '../models';

interface UserLoginPayload {
  userId: string;
  password: string;
}

export default class AuthenticationController extends Controller {
  constructor() {
    super('Authentication');
  }
  public async userLogin(
    req: Request<{}, {}, UserLoginPayload>
  ): Promise<ControllerResult> {
    const schema = Joi.object<UserLoginPayload>({
      userId: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const { userId, password } = req.body;
    const admin = await AdminModel.findOne({ adminId: userId });
    const customer = await CustomerModel.findOne({ accountNo: userId });
    const employee = await EmployeeModel.findOne({ employeeId: userId });

    const user = admin || customer || employee;

    if (!user) {
      throw new BaseError('BAD_REQUEST', 'invalid user id');
    }

    const comparePassword = await bcrypt.compare(password!, user.password!);
    if (!comparePassword) {
      throw new BaseError(
        'BAD_REQUEST',
        'invalid user id and password combination'
      );
    }

    const token = jwt.sign({ userId: user._id }, getEnvVariables().jwtToken);

    const data = user.toObject();
    delete data.password;

    const type = admin ? 'admin' : employee ? 'employee' : 'customer';

    return {
      data: {
        type,
        token,
        ...data,
      },
      message: 'authentication successful',
    };
  }

  public async fetchAuthenticatedUser(req: Request): Promise<ControllerResult> {
    const { admin, employee, customer } = req;
    const type = admin ? 'admin' : employee ? 'employee' : 'customer';
    const data = admin || employee || customer;

    return {
      data: {
        type,
        ...data,
      },
      message: 'authentication successful',
    };
  }
}
