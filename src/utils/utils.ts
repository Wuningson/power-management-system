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
  // Mailer function
}
