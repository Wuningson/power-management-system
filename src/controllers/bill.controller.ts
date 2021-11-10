import Joi from 'joi';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import Controller from './controller';
import BaseError from '../global/error';
import { LeanDocument } from 'mongoose';
import BlockchainHelper from '../config/provendb';
import { CustomerModel, EmployeeModel } from '../models';

export interface BlockchainBillReturn
  extends Pick<
    BlockChainBill,
    '_id' | 'rate' | 'unitsUsed' | 'billingMonth' | 'createdAt'
  > {
  status: ProofStatus;
  createdBy: LeanDocument<EmployeeDocument>;
  customerId: LeanDocument<CustomerDocument>;
}

export default class BillController extends Controller {
  constructor() {
    super('Bill');
  }

  public async addCustomerBill(
    req: Request<{}, {}, AddCustomerBillPayload>
  ): Promise<ControllerResult> {
    if (!req.employee) {
      throw new BaseError('FORBIDDEN', 'authorization failed');
    }

    const schema = Joi.object<AddCustomerBillPayload>({
      rate: Joi.number().required(),
      unitsUsed: Joi.number().required(),
      customerId: Joi.string().required(),
      billingMonth: Joi.number().min(0).max(11).required(),
    });

    const { error } = schema.validate(req.body);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const { rate, unitsUsed, customerId, billingMonth } = req.body;

    const customer = await CustomerModel.findById(customerId).select(
      '-password'
    );
    if (!customer) {
      throw new BaseError('BAD_REQUEST', 'invalid customer id');
    }

    const checkBill = await BlockchainHelper.fetchAssets<Bill>(
      { customerId, billingMonth },
      'bill'
    );
    if (checkBill.length > 0) {
      throw new BaseError(
        'BAD_REQUEST',
        `customer's bill has been added for this billing month already`
      );
    }

    const date = new Date();
    const asset: Bill = {
      rate,
      unitsUsed,
      customerId,
      billingMonth,
      createdAt: date,
      createdBy: String(req.employee._id),
    };

    await BlockchainHelper.storeAsset(asset, 'bill');

    return {
      data: null,
      message: 'customer bill added successfully',
    };
  }

  public async fetchCustomerBills(
    req: Request<{}, {}, {}, FetchCustomerBillsPayload>
  ): Promise<ControllerResult> {
    if (!req.customer && !req.admin && !req.employee) {
      throw new BaseError('FORBIDDEN', 'authorization failed');
    }

    const customerValidation = !req.customer
      ? Joi.string().required()
      : Joi.string().allow('');

    const schema = Joi.object<FetchCustomerBillsPayload>({
      page: Joi.string().allow(''),
      limit: Joi.string().allow(''),
      customerId: customerValidation,
    });

    const { error } = schema.validate(req.query);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const { page, limit, customerId: id } = req.query;
    const customerId: string = req.customer ? req.customer._id : id;

    const customer = await CustomerModel.findById(customerId).select(
      '-password'
    );
    if (!customer) {
      throw new BaseError('BAD_REQUEST', 'invalid customer id');
    }

    const bills = await BlockchainHelper.fetchAssets<BlockChainBill>(
      { customerId },
      'bill'
    );
    if (bills.length === 0) {
      return {
        data: [],
        message: `customer's bills fetched successfully`,
      };
    }

    const data: BlockchainBillReturn[] = [];
    for (const bill of bills) {
      const status = await BlockchainHelper.getProofStatus(bill._id, 'bill');
      if (status !== 'Valid' && !req.employee) {
        continue;
      }

      const employee = await EmployeeModel.findById(bill.createdBy).select(
        '-password'
      );
      if (!employee) {
        continue;
      }

      const result: BlockchainBillReturn = {
        status,
        ...bill,
        createdBy: employee.toJSON(),
        customerId: customer.toJSON(),
        createdAt: new Date(bill.createdAt),
      };
      data.push(result);
    }

    return {
      data,
      message: `customer's bills fetched successfully`,
    };
  }

  public async fetchBillById(
    req: Request<{ billId?: string }>
  ): Promise<ControllerResult> {
    const { billId } = req.params;

    const [bill] = await BlockchainHelper.fetchAssets<BlockChainBill>(
      { _id: ObjectId(billId) },
      'bill'
    );
    if (!bill) {
      throw new BaseError('BAD_REQUEST', 'invalid bill id');
    }

    const { createdAt, createdBy, customerId } = bill;

    const employee = await EmployeeModel.findById(createdBy).select(
      '-password'
    );
    const customer = await CustomerModel.findById(customerId).select(
      '-password'
    );

    if (!employee || !customer) {
      throw new BaseError('BAD_REQUEST', 'invalid bill id');
    }

    const status = await BlockchainHelper.getProofStatus(bill._id, 'bill');

    if (req.customer && status !== 'Valid') {
      throw new BaseError('BAD_REQUEST', 'invalid bill id');
    }

    const data: BlockchainBillReturn = {
      status,
      ...bill,
      createdBy: employee.toObject(),
      createdAt: new Date(createdAt),
      customerId: customer.toObject(),
    };

    return {
      data,
      message: `bill fetched by id successfully`,
    };
  }

  public async updateBillById(
    req: Request<{ billId?: string }, {}, AddCustomerBillPayload>
  ): Promise<ControllerResult> {
    if (!req.employee) {
      throw new BaseError('FORBIDDEN', 'authorization failed');
    }

    const schema = Joi.object<AddCustomerBillPayload>({
      rate: Joi.number().required(),
      unitsUsed: Joi.number().required(),
      customerId: Joi.string().required(),
      billingMonth: Joi.number().min(0).max(11).required(),
    });

    const { error } = schema.validate(req.body);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const { billId } = req.params;
    const { rate, unitsUsed, customerId, billingMonth } = req.body;

    const customer = await CustomerModel.findById(customerId).select(
      '-password'
    );
    if (!customer) {
      throw new BaseError('BAD_REQUEST', 'invalid customer id');
    }

    const [bill] = await BlockchainHelper.fetchAssets<BlockChainBill>(
      { _id: ObjectId(billId) },
      'bill'
    );
    if (!bill) {
      throw new BaseError('BAD_REQUEST', 'invalid bill id');
    }

    const date = new Date();
    const asset: Bill = {
      rate,
      unitsUsed,
      customerId,
      billingMonth,
      createdAt: date,
      createdBy: String(req.employee._id),
    };

    await BlockchainHelper.updateAsset(
      { _id: ObjectId(billId) },
      'bill',
      asset
    );

    return {
      data: null,
      message: 'bill updated successfully',
    };
  }
}
