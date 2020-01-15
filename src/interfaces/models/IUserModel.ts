import { Model } from "mongoose";
import { IUserDocument } from "./IUserDocument";

export interface IUserModel extends Model<IUserDocument> {}