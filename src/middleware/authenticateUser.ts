import jwt from 'jsonwebtoken';
import getEnvVariables from '../config/env';
import BaseError, { handleError } from '../global/error';
import { NextFunction, Request, Response } from 'express';
import { AdminModel, CustomerModel, EmployeeModel } from '../models';

type DecodedJWTToken =
  | string
  | {
      userId?: string;
    };

const getAuthenticationError = () =>
  new BaseError('UNAUTHORIZED', 'authentication failed');

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw getAuthenticationError();
    }

    const validatedToken = token.startsWith('Bearer ')
      ? token.slice(7, token.length)
      : token;

    const { jwtToken } = getEnvVariables();
    const decoded = jwt.verify(validatedToken, jwtToken) as DecodedJWTToken;

    if (typeof decoded === 'string') {
      throw getAuthenticationError();
    }

    const { userId } = decoded;
    const customer = await CustomerModel.findById(userId).select('-password');
    if (customer) {
      req.customer = customer.toObject();
      return next();
    }

    const admin = await AdminModel.findById(userId).select('-password');
    if (admin) {
      req.admin = admin.toObject();
      return next();
    }

    const employee = await EmployeeModel.findById(userId).select('-password');
    if (employee) {
      req.employee = employee.toObject();
      return next();
    }

    throw getAuthenticationError();
  } catch (err) {
    const { statusCode, response } = handleError(err);

    return res.status(statusCode).json(response);
  }
};
