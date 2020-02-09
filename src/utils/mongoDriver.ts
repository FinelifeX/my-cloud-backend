import mongoose from 'mongoose';
import { ConnectionOptions } from 'mongoose';
import { IDatabaseDriver } from 'interfaces';

export class MongoDriver implements IDatabaseDriver {
  options: ConnectionOptions;

  constructor() {
    this.options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    };
  }

  connect() {
    return mongoose.connect(
      process.env.MONGODB_URL,
      this.options,
    );
  }
}