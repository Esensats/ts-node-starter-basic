/* import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

export const User = mongoose.model('User', userSchema); */

import { Schema, model, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
// import { IRole } from './role.js'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  roles: Schema.Types.ObjectId[]
  created: Date
}

interface IUserMethods {
  comparePassword(password: string): boolean
}

type UserModel = Model<IUser, object, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
  created: { type: Date, default: Date.now },
})

userSchema.method(
  'comparePassword',
  function comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
)

export const User = model<IUser, UserModel>('User', userSchema)

