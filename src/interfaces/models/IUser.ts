import { Document } from 'mongoose';

interface IUser extends Document {
  name: string,
  password: string,
  email: string, 
  tokens: [{
    token: {
      type: string, 
      required: boolean 
    }
  }],
  generateAuthToken(): Promise<string>,
}

export default IUser;