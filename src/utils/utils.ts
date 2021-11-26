import bcrypt from 'bcryptjs';
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

  // Mailer function
}
