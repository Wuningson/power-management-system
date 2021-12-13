import bcrypt from 'bcryptjs';
import getEnvVariables from '../config/env';
import nodemailer from 'nodemailer';

const { userAuth, passwordAuth } = getEnvVariables();
export class Utils {
  public static transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: userAuth,
      pass: passwordAuth,
    },
  });

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

  public static paymentReceived(
    amount: number,
    firstName: string,
    lastName: string,
    email: string
  ) {
    const template = {
      from: 'admin@pms.com',
      subject: 'Login Details',
      to: email,
      html: `<!DOCTYPE html>
<html  style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Billing e.g. invoices and receipts</title>

<style type="text/css">
img {
max-width: 100%;
}
body {
-webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em;
}
body {
background-color: #f6f6f6;
}
@media only screen and (max-width: 640px) {
  body {
    padding: 0 !important;
  }
  h1 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h2 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h3 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h4 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h1 {
    font-size: 22px !important;
  }
  h2 {
    font-size: 18px !important;
  }
  h3 {
    font-size: 16px !important;
  }
  .container {
    padding: 0 !important; width: 100% !important;
  }
  .content {
    padding: 0 !important;
  }
  .content-wrap {
    padding: 10px !important;
  }
  .invoice {
    width: 100% !important;
  }
}
</style>
</head>

<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">

<table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
    <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">
      <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
        <table class="main" width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-wrap aligncenter" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; margin: 0; padding: 20px;" align="center" valign="top">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                    <h1 class="aligncenter" style="font-family: 'Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif; box-sizing: border-box; font-size: 32px; color: #000; line-height: 1.2em; font-weight: 500; text-align: center; margin: 40px 0 0;" align="center">₦${amount} Paid</h1>
                  </td>
                </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                    <h2 class="aligncenter" style="font-family: 'Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif; box-sizing: border-box; font-size: 24px; color: #000; line-height: 1.2em; font-weight: 400; text-align: center; margin: 40px 0 0;" align="center">Thanks for using Power Management System.</h2>
                  </td>
                </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block aligncenter" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">
                    <table class="invoice" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; text-align: left; width: 80%; margin: 40px auto;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 5px 0;" valign="top">${firstName} ${lastName}<br style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" /><br style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />${new Date().toDateString()}</td>
                      </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 5px 0;" valign="top">
                          <table class="invoice-items" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" valign="top">Payment for bill</td>
                              <td class="alignright" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="right" valign="top">₦ ${amount}</td>
                            </tr><tr class="total" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="alignright" width="80%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="right" valign="top">Total</td>
                              <td class="alignright" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="right" valign="top">₦ ${amount}</td>
                            </tr></table></td>
                      </tr></table></td>
                </tr>
                </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block aligncenter" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">
                    Power Management System
                  </td>
                </tr></table></td>
          </tr></table><div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
    </td>
    <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
  </tr></table></body>
</html>`,
    };

    this.transport.sendMail(template, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log(info);
    });
  }

  public static sendBill(
    email: string,
    unitsUsed: number,
    rate: number,
    month: number,
    firstName: string,
    lastName: string,
    userId: string
  ) {
    const template = {
      from: 'admin@pms.com',
      subject: 'New Bill Added',
      to: email,
      html: `
        <!DOCTYPE html>
<html  style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Billing e.g. invoices and receipts</title>

<style type="text/css">
img {
max-width: 100%;
}
body {
-webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em;
}
body {
background-color: #f6f6f6;
}
@media only screen and (max-width: 640px) {
  body {
    padding: 0 !important;
  }
  h1 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h2 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h3 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h4 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h1 {
    font-size: 22px !important;
  }
  h2 {
    font-size: 18px !important;
  }
  h3 {
    font-size: 16px !important;
  }
  .container {
    padding: 0 !important; width: 100% !important;
  }
  .content {
    padding: 0 !important;
  }
  .content-wrap {
    padding: 10px !important;
  }
  .invoice {
    width: 100% !important;
  }
}
</style>
</head>

<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">

<table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
    <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">
      <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
        <table class="main" width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-wrap aligncenter" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; margin: 0; padding: 20px;" align="center" valign="top">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                  </td>
                </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                    <h2 class="aligncenter" style="font-family: 'Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif; box-sizing: border-box; font-size: 24px; color: #000; line-height: 1.2em; font-weight: 400; text-align: center; margin: 40px 0 0;" align="center">Thanks for using Power Management System.</h2>
                  </td>
                </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block aligncenter" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">
                    <table class="invoice" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; text-align: left; width: 80%; margin: 40px auto;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 5px 0;" valign="top">${firstName} ${lastName}<br style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" /><br style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />${this.getMonth(
        month
      )}</td>
                      </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 5px 0;" valign="top">
                          <table class="invoice-items" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" valign="top">Units Used:</td>
                              <td class="alignright" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="right" valign="top">${unitsUsed}</td>
                            </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" valign="top">Rate</td>
                              <td class="alignright" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="right" valign="top">₦ ${rate}</td>
                            </tr><tr class="total" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="alignright" width="80%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="right" valign="top">Total</td>
                              <td class="alignright" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 2px; border-top-color: #333; border-top-style: solid; border-bottom-color: #333; border-bottom-width: 2px; border-bottom-style: solid; font-weight: 700; margin: 0; padding: 5px 0;" align="right" valign="top">₦ ${
                                unitsUsed * rate
                              }</td>
                            </tr></table></td>
                      </tr></table></td>
                </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block aligncenter" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">
                    <a href="https://power-management-system-fe.vercel.app/customer/payments/${userId}" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #348eda; text-decoration: underline; margin: 0;">View in browser</a>
                  </td></table></td>
          </tr></table><div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
</div></div>
    </td>
    <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
  </tr></table></body>
</html>
      `,
    };

    this.transport.sendMail(template, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log(info);
    });
  }

  public static sendWelcomeEmail(
    email: string,
    firstName: string,
    accountNo: string,
    password: string
  ) {
    const template = {
      from: 'admin@pms.com',
      subject: 'Login Details',
      to: email,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <!--[if gte mso 9
      ]><xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml><!
    [endif]-->
    <title>meowgun</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
    <meta name="format-detection" content="telephone=no" />
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,700,700i,900,900i"
      rel="stylesheet"
    />
    <!--<![endif]-->
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        -webkit-font-smoothing: antialiased !important;
      }
      img {
        border: 0 !important;
        outline: none !important;
      }
      p {
        margin: 0px !important;
        padding: 0px !important;
      }
      table {
        border-collapse: collapse;
        mso-table-lspace: 0px;
        mso-table-rspace: 0px;
      }
      td,
      a,
      span {
        border-collapse: collapse;
        mso-line-height-rule: exactly;
      }
      .ExternalClass * {
        line-height: 100%;
      }
      .em_blue a {
        text-decoration: none;
        color: #264780;
      }
      .em_grey a {
        text-decoration: none;
        color: #434343;
      }
      .em_white a {
        text-decoration: none;
        color: #ffffff;
      }

      @media only screen and (min-width: 481px) and (max-width: 649px) {
        .em_main_table {
          width: 100% !important;
        }
        .em_wrapper {
          width: 100% !important;
        }
        .em_hide {
          display: none !important;
        }
        .em_aside10 {
          padding: 0px 10px !important;
        }
        .em_h20 {
          height: 20px !important;
          font-size: 1px !important;
          line-height: 1px !important;
        }
        .em_h10 {
          height: 10px !important;
          font-size: 1px !important;
          line-height: 1px !important;
        }
        .em_aside5 {
          padding: 0px 10px !important;
        }
        .em_ptop2 {
          padding-top: 8px !important;
        }
      }
      @media only screen and (min-width: 375px) and (max-width: 480px) {
        .em_main_table {
          width: 100% !important;
        }
        .em_wrapper {
          width: 100% !important;
        }
        .em_hide {
          display: none !important;
        }
        .em_aside10 {
          padding: 0px 10px !important;
        }
        .em_aside5 {
          padding: 0px 8px !important;
        }
        .em_h20 {
          height: 20px !important;
          font-size: 1px !important;
          line-height: 1px !important;
        }
        .em_h10 {
          height: 10px !important;
          font-size: 1px !important;
          line-height: 1px !important;
        }
        .em_font_11 {
          font-size: 12px !important;
        }
        .em_font_22 {
          font-size: 22px !important;
          line-height: 25px !important;
        }
        .em_w5 {
          width: 7px !important;
        }
        .em_w150 {
          width: 150px !important;
          height: auto !important;
        }
        .em_ptop2 {
          padding-top: 8px !important;
        }
        u + .em_body .em_full_wrap {
          width: 100% !important;
          width: 100vw !important;
        }
      }
      @media only screen and (max-width: 374px) {
        .em_main_table {
          width: 100% !important;
        }
        .em_wrapper {
          width: 100% !important;
        }
        .em_hide {
          display: none !important;
        }
        .em_aside10 {
          padding: 0px 10px !important;
        }
        .em_aside5 {
          padding: 0px 8px !important;
        }
        .em_h20 {
          height: 20px !important;
          font-size: 1px !important;
          line-height: 1px !important;
        }
        .em_h10 {
          height: 10px !important;
          font-size: 1px !important;
          line-height: 1px !important;
        }
        .em_font_11 {
          font-size: 11px !important;
        }
        .em_font_22 {
          font-size: 22px !important;
          line-height: 25px !important;
        }
        .em_w5 {
          width: 5px !important;
        }
        .em_w150 {
          width: 150px !important;
          height: auto !important;
        }
        .em_ptop2 {
          padding-top: 8px !important;
        }
        u + .em_body .em_full_wrap {
          width: 100% !important;
          width: 100vw !important;
        }
      }
    </style>
  </head>
  <body
    class="em_body"
    style="margin: 0px auto; padding: 0px"
    bgcolor="#efefef"
  >
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      class="em_full_wrap"
      align="center"
      bgcolor="#efefef"
    >
      <tr>
        <td align="center" valign="top">
          <table
            align="center"
            width="650"
            border="0"
            cellspacing="0"
            cellpadding="0"
            class="em_main_table"
            style="width: 650px; table-layout: fixed"
          >
            <tr>
              <td
                align="center"
                valign="top"
                style="padding: 0 25px"
                class="em_aside10"
              >
                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                >
                  <tr>
                    <td height="25" style="height: 25px" class="em_h20">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td height="28" style="height: 28px" class="em_h20">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      class="em_full_wrap"
      align="center"
      bgcolor="#efefef"
    >
      <tr>
        <td align="center" valign="top" class="em_aside5">
          <table
            align="center"
            width="650"
            border="0"
            cellspacing="0"
            cellpadding="0"
            class="em_main_table"
            style="width: 650px; table-layout: fixed"
          >
            <tr>
              <td
                align="center"
                valign="top"
                style="padding: 0 25px; background-color: #ffffff"
                class="em_aside10"
              >
                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                >
                  <tr>
                    <td height="45" style="height: 45px" class="em_h20">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="em_blue em_font_22"
                      align="center"
                      valign="top"
                      style="
                        font-family: Arial, sans-serif;
                        font-size: 26px;
                        line-height: 29px;
                        color: #264780;
                        font-weight: bold;
                      "
                    >
                      Welcome to your Power Management System
                    </td>
                  </tr>
                  <tr>
                    <td
                      height="14"
                      style="height: 14px; font-size: 0px; line-height: 0px"
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="em_grey"
                      align="center"
                      valign="top"
                      style="
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 26px;
                        color: #434343;
                      "
                    >
                      Good day, ${firstName}, welcome to PMS.<br />Here are your
                      details for using the application:<br />
                      <span> Account No: ${accountNo}</span><br />
                      <span>Password: ${password}</span><br />
                    </td>
                  </tr>
                  <tr>
                    <td height="26" style="height: 26px" class="em_h20">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="top">
                      <table
                        width="250"
                        style="
                          width: 250px;
                          background-color: #6bafb2;
                          border-radius: 4px;
                        "
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        align="center"
                      >
                        <tr>
                          <td
                            class="em_white"
                            height="42"
                            align="center"
                            valign="middle"
                            style="
                              font-family: Arial, sans-serif;
                              font-size: 16px;
                              color: #ffffff;
                              font-weight: bold;
                              height: 42px;
                            "
                          >
                            <a
                              href="https://power-management-system-fe.vercel.app/signin"
                              target="_blank"
                              style="
                                text-decoration: none;
                                color: #ffffff;
                                line-height: 42px;
                                display: block;
                              "
                              >LOGIN TO YOUR ACCOUNT</a
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="25" style="height: 25px" class="em_h20">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="em_grey"
                      align="center"
                      valign="top"
                      style="
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 26px;
                        color: #434343;
                      "
                    >
                      Welcome once again and we are glad to have you onboard.
                    </td>
                  </tr>
                  <tr>
                    <td height="44" style="height: 44px" class="em_h20">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table
      width="100%"
      border="0"
      cellspacing="0"
      cellpadding="0"
      class="em_full_wrap"
      align="center"
      bgcolor="#efefef"
    >
      <tr>
        <td align="center" valign="top">
          <table
            align="center"
            width="650"
            border="0"
            cellspacing="0"
            cellpadding="0"
            class="em_main_table"
            style="width: 650px; table-layout: fixed"
          >
            <tr>
              <td
                align="center"
                valign="top"
                style="padding: 0 25px"
                class="em_aside10"
              >
                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                >
                  <tr>
                    <td height="40" style="height: 40px" class="em_h20">
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="top">
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        align="center"
                      ></table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      height="9"
                      style="font-size: 0px; line-height: 0px; height: 9px"
                      class="em_h10"
                    >
                      <img
                        src="/assets/pilot/images/templates/spacer.gif"
                        width="1"
                        height="1"
                        alt=""
                        border="0"
                        style="display: block"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="top">
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        align="center"
                      >
                        <tr>
                          <td
                            width="12"
                            align="left"
                            valign="middle"
                            style="
                              font-size: 0px;
                              line-height: 0px;
                              width: 12px;
                            "
                          >
                          </td>
                          <td
                            width="7"
                            style="width: 7px; font-size: 0px; line-height: 0px"
                            class="em_w5"
                          >
                            &nbsp;
                          </td>
                          <td
                            class="em_grey em_font_11"
                            align="left"
                            valign="middle"
                            style="
                              font-family: Arial, sans-serif;
                              font-size: 13px;
                              line-height: 15px;
                              color: #434343;
                            "
                          >
                            <a
                              href="https://power-management-system-fe.vercel.app/"
                              target="_blank"
                              style="text-decoration: none; color: #434343"
                              >Power Management System</a
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="35" style="height: 35px" class="em_h20">
                      &nbsp;
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td
                height="1"
                bgcolor="#dadada"
                style="font-size: 0px; line-height: 0px; height: 1px"
              >
                <img
                  src="/assets/pilot/images/templates/spacer.gif"
                  width="1"
                  height="1"
                  alt=""
                  border="0"
                  style="display: block"
                />
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="padding: 0 25px"
                class="em_aside10"
              >
                <table
                  width="100%"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                >
                  <tr>
                    <td
                      height="16"
                      style="font-size: 0px; line-height: 0px; height: 16px"
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td align="center" valign="top">
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        align="left"
                        class="em_wrapper"
                      >
                        <tr>
                          <td
                            class="em_grey"
                            align="center"
                            valign="middle"
                            style="
                              font-family: Arial, sans-serif;
                              font-size: 11px;
                              line-height: 16px;
                              color: #434343;
                            "
                          >
                            &copy; Meowgun 2019 &nbsp;|&nbsp;
                            <a
                              href="#"
                              target="_blank"
                              style="text-decoration: underline; color: #434343"
                              >Unsubscribe</a
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td
                      height="16"
                      style="font-size: 0px; line-height: 0px; height: 16px"
                    >
                      &nbsp;
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td
                class="em_hide"
                style="
                  line-height: 1px;
                  min-width: 650px;
                  background-color: #efefef;
                "
              >
                <img
                  alt=""
                  src="/assets/pilot/images/templates/spacer.gif"
                  height="1"
                  width="650"
                  style="
                    max-height: 1px;
                    min-height: 1px;
                    display: block;
                    width: 650px;
                    min-width: 650px;
                  "
                  border="0"
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
    };

    this.transport.sendMail(template, (err, info) => {
      if (err) {
        console.log(err);
      }
      console.log(info);
    });
  }
}
