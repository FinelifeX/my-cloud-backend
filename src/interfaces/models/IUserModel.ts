import { Model } from "mongoose";
import { IUserDocument } from "./IUserDocument";

export interface IUserModel extends Model<IUserDocument> {
  findByCredentials(email: string, password: string): Promise<IUserDocument>; 
}