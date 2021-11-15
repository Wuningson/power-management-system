import Joi from 'joi';
import { Request } from 'express';
import Controller from './controller';
import { Utils } from '../utils/utils';
import BaseError from '../global/error';
import { CustomerModel, EmployeeModel } from '../models';

interface AddNewCustomerPayload
  extends Pick<
    Customer,
    | 'email'
    | 'address'
    | 'meterNo'
    | 'lastName'
    | 'password'
    | 'firstName'
    | 'accountNo'
    | 'middleName'
  > {}

export default class EmployeeController extends Controller {
  constructor() {
    super('Employee');
  }

  public async addNewCustomer(
    req: Request<{}, {}, AddNewCustomerPayload>
  ): Promise<ControllerResult> {
    if (!req.employee) {
      throw new BaseError('FORBIDDEN', 'authorization failed');
    }
    const schema = Joi.object<AddNewCustomerPayload>({
      email: Joi.string().required(),
      address: Joi.string().required(),
      meterNo: Joi.number().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      accountNo: Joi.string().required(),
      middleName: Joi.string().allow(''),
    });

    const { error } = schema.validate(req.body);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const {
      email,
      address,
      meterNo,
      lastName,
      password,
      firstName,
      accountNo,
      middleName,
    } = req.body;
    const checkAccountNo = await CustomerModel.findOne({ accountNo });
    if (checkAccountNo) {
      throw new BaseError('BAD_REQUEST', 'account no exists already');
    }

    const checkMeterNo = await CustomerModel.findOne({ meterNo });
    if (checkMeterNo) {
      throw new BaseError('BAD_REQUEST', 'meter no exists already');
    }

    const hashedPassword = await Utils.hashPassword(password!);

    const { _id } = req.employee;

    const customer = await CustomerModel.create({
      email,
      address,
      meterNo,
      lastName,
      firstName,
      accountNo,
      middleName,
      createdBy: _id,
      password: hashedPassword,
    });
    if (!customer) {
      throw new BaseError('BAD_REQUEST', 'could not add new customer');
    }

    return {
      data: null,
      message: 'new customer added successfully',
    };
  }

  public async fetchEmployeeById(req: Request<{ employeeId?: string }>) {
    if (!req.employee && !req.admin) {
      throw new BaseError('FORBIDDEN', 'authorization failed');
    }

    const { employeeId } = req.params;
    const employee = await EmployeeModel.findById(employeeId).select(
      '-password'
    );
    if (!employee) {
      throw new BaseError('BAD_REQUEST', 'invalid employee id');
    }

    return {
      data: employee.toObject(),
      message: 'customer fetched successfully',
    };
  }
}
