import { ConnectionOptions } from "mongoose";

export interface IDatabaseDriver {
  options: ConnectionOptions;
  connect(): Promise<any>;
}