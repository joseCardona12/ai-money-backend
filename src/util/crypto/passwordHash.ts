import bcrypt from "bcrypt";

export class PasswordHash {
  private static readonly SALT_ROUNDS = 12;

  // Hash password
  public static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  // Compare password with hash
  public static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
