import * as bcrypt from 'bcryptjs';

export const checkPassword = (
  password: string, 
  hashedPassword: string
) => bcrypt.compare(password, hashedPassword);