import mongoose from 'mongoose'

export interface IRole {
  name: 'gamer' | 'developer' | 'admin'
}

const roleSchema = new mongoose.Schema({
  name: String,
})

export const Role = mongoose.model<IRole>('Role', roleSchema)

export const ROLES = ['gamer', 'developer', 'admin']
