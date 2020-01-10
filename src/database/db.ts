import * as mongoose from 'mongoose';

const connectToDB = () => mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

export default connectToDB;