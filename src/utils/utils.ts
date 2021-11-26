import bcrypt from 'bcryptjs';
import sendgrid from '@sendgrid/mail';
import getEnvVariables from '../config/env';

const { sendgridKey } = getEnvVariables();
export class Utils {
  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  public static buildTruthyObject<T extends object>(body: T): Partial<T> {
    return Object.entries(body).reduce((acc, [key, value]) => {
      if (value) return { ...acc, [key]: value };
      return acc;
    }, {});
  }
  public static months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  public static getMonth(billingMonth: number) {
    if (billingMonth < this.months.length) return this.months[billingMonth];
    else return this.months[11];
  }

  public static resolveByMonth<T extends Record<string, any>>(
    array: T[],
    key: keyof T
  ) {
    const accumulator: Record<string, T[]> = {};
    const data = array.reduce((acc, curr) => {
      const currentValue =
        key === 'createdAt'
          ? this.getMonth(new Date(curr[key]).getMonth())
          : curr[key];
      if (currentValue === undefined) return acc;
      return Object.assign(acc, {
        [currentValue]: (acc[currentValue] || []).concat(curr),
      });
    }, accumulator);

    console.log(data);
    const keys = Object.keys(data);
    const values = Object.values(data);

    return Object.fromEntries(
      keys.map((key, idx) => [
        key,
        values[idx].reduce(
          (a, c) => (c.amount ? a + c.amount : a + c.unitsUsed * c.rate),
          0
        ),
      ])
    );
  }

  public static sendBill(
    email: string,
    unitsUsed: number,
    rate: number,
    month: number,
    firstName: string
  ) {
    sendgrid.setApiKey(sendgridKey);
    const template = {
      from: 'admin@pms.com',
      subject: 'New Bill Added',
      to: email,
      html: `<h1>Bill for ${this.getMonth(month)} has been added</h1>
      <p>Good day, ${firstName}.</p>\n
      <p>Here's your bill for the billing cycle:\n
      Rate: ${rate}
      Units used: ${unitsUsed}
      Total: ${rate * unitsUsed}
      </p>\n
      <p>Endeavour to pay your bills as at due. Thanks for your usual cooperation</p>
      `,
    };
    sendgrid.send(template);
  }

  public static sendWelcomeEmail(
    email: string,
    firstName: string,
    accountNo: string,
    password: string,
    meterNo: number
  ) {
    sendgrid.setApiKey(sendgridKey);
    const template = {
      from: 'admin@pms.com',
      subject: 'Login Details',
      to: email,
      html: `<h1>Welcome to your Power Management System</h1>
      <p>Good day, ${firstName}, welcome to PMS.</p>\n
      <p>Here are your details for using the application:\n
      Account No: ${accountNo}
      Password: ${password}
      Meter Number: ${meterNo}
      </p>\n
      <p>Welcome once again and we are glad to have you onboard</p>
      `,
    };
    sendgrid.send(template);
  }
}
