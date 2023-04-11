import express from 'express'
import { User } from '../models/user.js'

const userRouter = express.Router()

// Create a new user
userRouter.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get all users
userRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (err) {
    res.status(500).send(err)
  }
})

userRouter.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (user) res.status(200).send(user.toJSON())
  } catch (err) {
    res.status(400).send(err)
  }
})
userRouter.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findByIdAndRemove(id)
    if (user) res.status(200).send(user.toJSON())
  } catch (err) {
    res.status(500).send(err)
  }
})

export { userRouter }
