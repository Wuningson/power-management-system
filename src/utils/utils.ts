import bcrypt from 'bcryptjs';

export class Utils {
  public static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}