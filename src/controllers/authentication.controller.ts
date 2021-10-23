import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Controller from './controller';
import BaseError from '../global/error';
import { Request, Response } from 'express';
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
    req: Request<{}, {}, UserLoginPayload>,
    res: Response
  ) {
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
    const user =
      (await AdminModel.findOne({ adminId: userId })) ||
      (await CustomerModel.findOne({ accountNo: userId })) ||
      (await EmployeeModel.findOne({ employeeId: userId }));

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

    return {
      data: {
        token,
        ...data,
      },
      message: 'authentication successful',
    };
  }
}
