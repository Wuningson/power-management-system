import Joi from 'joi';
import crypto from 'crypto';
import { Request } from 'express';
import { ObjectId } from 'mongodb';
import Controller from './controller';
import BaseError from '../global/error';
import randomstring from 'randomstring';
import { LeanDocument } from 'mongoose';
import { CustomerModel } from '../models';
import getEnvVariables from '../config/env';
import PaystackUtils from '../utils/paystack';
import BlockchainHelper from '../config/provendb';

interface BlockChainPaymentReturn
  extends Pick<
    BlockChainPayment,
    '_id' | 'amount' | 'createdAt' | 'reference' | 'status'
  > {
  proofStatus: ProofStatus;
  customerId: LeanDocument<CustomerDocument>;
}

export default class PaymentController extends Controller {
  constructor() {
    super('Payment');
  }

  public async generatePaymentLink(
    req: Request<{}, {}, GeneratePaymentLink>
  ): Promise<ControllerResult> {
    if (!req.customer) {
      throw new BaseError('FORBIDDEN', 'authorization failed');
    }

    const schema = Joi.object<GeneratePaymentLink>({
      email: Joi.string().required(),
      amount: Joi.number().required(),
      channel: Joi.string().valid('bank_transfer', 'card').required(),
    });

    const { error } = schema.validate(req.body);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const { email, amount, channel } = req.body;
    const { _id } = req.customer;
    const metadata = JSON.stringify({ userId: String(_id) });
    const reference = randomstring.generate(12);
    const response = await PaystackUtils.generatePaymentLink({
      email,
      amount,
      channel,
      metadata,
      reference,
    });

    return {
      data: response.data.authorization_url,
      message: 'payment link generated successfully',
    };
  }

  public async paymentWebhook(
    req: Request<{}, {}, PaymentCallbackPayload>
  ): Promise<ControllerResult> {
    const hash = crypto
      .createHmac('sha512', getEnvVariables().paystackSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    if (hash != req.headers['x-paystack-signature']) {
      throw new BaseError('BAD_REQUEST', 'verification failed');
    }

    const {
      event,
      data: { reference },
    } = req.body;

    if (event === 'charge.success') {
      const { data } = await PaystackUtils.get<VerifyTransaction>(
        `/transaction/verify/${reference}`
      );

      const { amount, status, metadata, paidAt } = data.data;
      if (status === 'success') {
        const nairaValue = amount / 100;
        const asset: Payment = {
          reference,
          amount: nairaValue,
          status: 'successful',
          createdAt: new Date(paidAt),
          customerId: metadata.userId,
        };

        await BlockchainHelper.storeAsset(asset, 'payment');
      }
    }

    return {
      data: null,
      message: '',
    };
  }

  public async paymentCallback(req: Request): Promise<ControllerResult> {
    return {
      data: null,
      message: '',
    };
  }

  public async fetchUserPayments(
    req: Request<{}, {}, FetchUserPaymentsPayload>
  ): Promise<ControllerResult> {
    const customerValidation = !req.customer
      ? Joi.string().required()
      : Joi.string().allow('');
    const schema = Joi.object<FetchUserPaymentsPayload>({
      customerId: customerValidation,
    });

    const { error } = schema.validate(req.query);
    console.log({ error });
    if (error) {
      throw new BaseError('BAD_REQUEST', error.details[0].message);
    }

    const { customerId: id } = req.query;
    const customerId: string = req.customer ? req.customer._id : id;

    const customer = await CustomerModel.findById(customerId);
    if (!customer) {
      throw new BaseError('BAD_REQUEST', 'invalid customer id');
    }

    const payments = await BlockchainHelper.fetchAssets<BlockChainPayment>(
      { customerId },
      'payment'
    );

    const data: BlockChainPaymentReturn[] = [];

    for (const payment of payments) {
      const status = await BlockchainHelper.getProofStatus(
        payment._id,
        'payment'
      );
      if (status !== 'Valid' && !req.employee) {
        continue;
      }

      const result: BlockChainPaymentReturn = {
        ...payment,
        proofStatus: status,
        customerId: customer.toObject(),
        createdAt: new Date(payment.createdAt),
      };

      data.push(result);
    }

    return {
      data,
      message: 'payment fetched successfully',
    };
  }
}
