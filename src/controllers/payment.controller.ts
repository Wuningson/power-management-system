import { Request } from 'express';
import Joi from 'joi';
import BaseError from '../global/error';
import Controller from './controller';
import PaystackUtils from '../utils/paystack';
import randomstring from 'randomstring';
import crypto from 'crypto';
import getEnvVariables from '../config/env';

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

  public async test(req: Request): Promise<ControllerResult> {
    return {
      data: null,
      message: '',
    };
  }

  public async paymentCallback(
    req: Request<{}, {}, PaymentCallbackPayload>
  ): Promise<ControllerResult> {
    var hash = crypto
      .createHmac('sha512', getEnvVariables().paystackSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    if (hash != req.headers['x-paystack-signature']) {
      throw new BaseError('BAD_REQUEST', 'verification failed');
    }

    const { event, data } = req.body;

    if (event === 'charge.success') {
      const { data: transaction } = await PaystackUtils.get<VerifyTransaction>(
        `/transaction/verify/${data.reference}`
      );
      console.log(transaction);
    }

    return {
      data: null,
      message: '',
    };
  }
}
