import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { IUserDocument, IUserModel } from '../interfaces';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  authToken: {
    type: String,
  },
});

UserSchema.pre<IUserDocument>('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET);
    this.authToken = token;
};

UserSchema.statics.findByCredentials = async function(email: string, password: string) {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid login credentials!');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error('Invalid login credentials!');
  }
  
  return user;
}

export const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
