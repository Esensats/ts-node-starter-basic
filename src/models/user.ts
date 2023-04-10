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

import { Schema, model, Document } from 'mongoose'
import { IRole } from './role.js'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  roles: IRole[]
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
})

export const User = model<IUser>('User', userSchema)
