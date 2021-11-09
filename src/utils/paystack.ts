import axios from 'axios';
import getEnvVariables from '../config/env';

const { paystackSecret } = getEnvVariables();

export default class PaystackUtils {
  private static axiosInstance = axios.create({
    headers: {
      authorization: `Bearer ${paystackSecret}`,
      'content-type': 'application/json',
    },
    baseURL: `https://api.paystack.co`,
  });

  public static async generatePaymentLink(payload: GeneratePaymentLinkPayload) {
    const { email, amount, reference, callbackUrl, channel, metadata } =
      payload;
    const koboValue = amount * 100;

    const response = await this.axiosInstance.post<GeneratePaymentLinkResponse>(
      '/transaction/initialize',
      {
        email,
        metadata,
        reference,
        amount: koboValue,
        channels: [channel],
        ...(callbackUrl && { callbackUrl }),
      }
    );

    return response.data;
  }

  public static get<T>(url: string) {
    return this.axiosInstance.get<T>(url);
  }
}
