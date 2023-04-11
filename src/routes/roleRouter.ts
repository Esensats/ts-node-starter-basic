import express from 'express'
import { Role } from '../models/role.js'

const roleRouter = express.Router()

// Get all roles
roleRouter.get('/roles', async (req, res) => {
  try {
    const roles = await Role.find()
    res.send(roles)
  } catch (err) {
    res.status(500).send(err)
  }
})

export { roleRouter }
