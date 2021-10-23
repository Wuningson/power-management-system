import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Controller from './controller';
import { Utils } from '../utils/utils';
import BaseError from '../global/error';
import { Request, Response } from 'express';
import getEnvVariables from '../config/env';
import { AdminModel, EmployeeModel } from '../models';

interface CreateAdminPayload
  extends Pick<Admin, 'firstName' | 'lastName' | 'password' | 'adminId'> {}

interface AddNewEmployeePayload
  extends Pick<
    Employee,
    'firstName' | 'lastName' | 'password' | 'employeeId'
  > {}

export default class AdminController extends Controller {
  constructor() {
    super('Admin');
  }

  public async createAdmin(
    req: Request<{}, {}, CreateAdminPayload>,
    res: Response
  ): Promise<ControllerResult> {
    const schema = Joi.object({
      adminId: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const check = await AdminModel.find();
    if (check.length > 0) {
      throw new BaseError('BAD_REQUEST', 'admin exists already');
    }

    const { firstName, lastName, password, adminId } = req.body;
    const hashedPassword = await Utils.hashPassword(password!);

    const admin = await AdminModel.create({
      adminId,
      lastName,
      firstName,
      password: hashedPassword,
    });

    if (!admin) {
      throw new BaseError('BAD_REQUEST', 'could not create admin');
    }

    const data = admin.toObject();
    delete data.password;
    return {
      data,
      message: 'admin creted successfully',
    };
  }

  public async addNewEmployee(
    req: Request<{}, {}, AddNewEmployeePayload>,
    res: Response
  ): Promise<ControllerResult> {
    if (!req.admin) {
      throw new BaseError('FORBIDDEN', 'authorization failed');
    }

    const schema = Joi.object<AddNewEmployeePayload>({
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      employeeId: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const { employeeId, firstName, lastName, password } = req.body;
    const { _id } = req.admin;

    const check = await AdminModel.findOne({ employeeId });
    if (check) {
      throw new BaseError('BAD_REQUEST', 'employee exists already');
    }

    const hashedPassword = await Utils.hashPassword(password!);

    const employee = await EmployeeModel.create({
      lastName,
      firstName,
      employeeId,
      createdBy: _id,
      password: hashedPassword,
    });

    if (!employee) {
      throw new BaseError('BAD_REQUEST', 'could not create employee');
    }

    return {
      data: null,
      message: 'new employee added successfully',
    };
  }
}
