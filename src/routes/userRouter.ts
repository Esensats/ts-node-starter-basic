import express from 'express'
import { User } from '../models/user.js'
import { Role } from '../models/role.js'
import { verifyToken } from '../middlewares/authJwt.js'

const userRouter = express.Router()

// Create a new user
userRouter.post('/users', async (req, res) => {
  try {
    Role.findOne({ name: 'gamer' })
      .exec()
      .then((role) => {
        const user = new User({ ...req.body, ...{ roles: [role?._id] } })
        user.save().then(() => {
          res.status(201).send(user)
        })
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send(err)
      })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get all users
userRouter.get('/users', verifyToken, async (req, res) => {
  try {
    await User.find()
      .populate('roles')
      .then((users) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        res.json(users)
      })
  } catch (err) {
    res.status(500).send(err)
  }
})

userRouter.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).lean()
    if (user) res.status(200).send(user)
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

