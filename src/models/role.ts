import mongoose from 'mongoose'

export interface IRole {
  name: string
}

const roleSchema = new mongoose.Schema({
  name: String,
})

export const Role = mongoose.model<IRole>('Role', roleSchema)
