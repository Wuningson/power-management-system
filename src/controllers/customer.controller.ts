import Joi from 'joi';
import { Request } from 'express';
import Controller from './controller';
import BaseError from '../global/error';
import { CustomerModel } from '../models';
import BlockchainHelper from '../config/provendb';
import { BlockchainBillReturn } from './bill.controller';
import { BlockChainPaymentReturn } from './payment.controller';

export default class CustomerController extends Controller {
  constructor() {
    super('Customer');
  }

  public async fetchCustomerById(
    req: Request<CustomerById>
  ): Promise<ControllerResult> {
    const schema = Joi.object<CustomerById>({
      customerId: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const { customerId } = req.params;
    const customer = await CustomerModel.findById(customerId).select(
      '-password'
    );
    if (!customer) {
      throw new BaseError('BAD_REQUEST', 'invalid customer id');
    }

    const payments =
      await BlockchainHelper.fetchAssets<BlockChainPaymentReturn>(
        { customerId },
        'payment'
      );
    const bills = await BlockchainHelper.fetchAssets<BlockchainBillReturn>(
      { customerId },
      'bill'
    );

    const totalPayment = payments.reduce((acc, { amount }) => acc + amount, 0);
    const totalBill = bills.reduce(
      (acc, { rate, unitsUsed }) => acc + rate * unitsUsed,
      0
    );

    return {
      data: { ...customer.toObject(), totalBill, totalPayment },
      message: 'customer fetched successfully',
    };
  }

  public async updateCustomerById(
    req: Request<CustomerById, {}, UpdateCustomerPayload>
  ): Promise<ControllerResult> {
    const schema = Joi.object<UpdateCustomerPayload>({
      email: Joi.string().allow(''),
      address: Joi.string().allow(''),
      meterNo: Joi.string().allow(''),
      lastName: Joi.string().allow(''),
      accountNo: Joi.string().allow(''),
      middleName: Joi.string().allow(''),
    });

    const { error } = schema.validate(req.query);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const { customerId } = req.params;
    let customer = await CustomerModel.findById(customerId).select('-password');
    if (!customer) {
      throw new BaseError('BAD_REQUEST', 'invalid customer id');
    }

    if (req.employee) {
      customer = await CustomerModel.findByIdAndUpdate(
        customerId,
        { ...req.body },
        { new: true }
      ).select('-password');
    }

    if (req.customer) {
      const { firstName, lastName, middleName, email } = req.body;
      customer = await CustomerModel.findByIdAndUpdate(
        customerId,
        { firstName, lastName, middleName, email },
        { new: true }
      ).select('-password');
    }

    return {
      data: customer,
      message: 'customer details updated successfully',
    };
  }

  public async fetchCustomers(req: Request): Promise<ControllerResult> {
    const customers = await CustomerModel.find({}).select('-password');
    if (!customers) {
      throw new BaseError('BAD_REQUEST', 'could not fetch customers');
    }

    const data = await Promise.all(
      customers.map(async customer => {
        const customerId = String(customer._id);
        const payments =
          await BlockchainHelper.fetchAssets<BlockChainPaymentReturn>(
            { customerId },
            'payment'
          );
        const bills = await BlockchainHelper.fetchAssets<BlockchainBillReturn>(
          { customerId },
          'bill'
        );

        const totalPayment = payments.reduce(
          (acc, { amount }) => acc + amount,
          0
        );
        const totalBill = bills.reduce(
          (acc, { rate, unitsUsed }) => acc + rate * unitsUsed,
          0
        );

        const res = customer.toObject();

        return {
          ...res,
          totalBill,
          totalPayment,
        };
      })
    );

    return {
      data,
      message: 'fetch ',
    };
  }
}
