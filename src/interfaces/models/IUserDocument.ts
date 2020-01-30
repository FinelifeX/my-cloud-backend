import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string,
  password: string,
  email: string,
  tokens: [{
    type: string,
    required: boolean
  }],
  generateAuthToken(): Promise<string>,
}