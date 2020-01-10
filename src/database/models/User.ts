import * as mongoose from "mongoose";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import IUser from '../../interfaces/models/IUser';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
})

userSchema.pre<IUser>('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid login credentials!');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('Invalid login credentials!');
  }

  return user;
}; 

const User = mongoose.model<IUser>('User', userSchema);

export default User;