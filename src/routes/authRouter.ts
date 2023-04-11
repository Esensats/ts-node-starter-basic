import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Role } from '../models/role.js'
import { User } from '../models/user.js'
import { Types } from 'mongoose'
import { authConfig } from '../config/auth.config.js'

const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
  try {
    const promise = new Promise(
      (resolve: (value: Types.ObjectId[]) => void, reject) => {
        const roles: Types.ObjectId[] = []
        if (req.body.roles?.length) {
          req.body.roles?.forEach(
            async (role: string, idx: number, arr: Types.ObjectId[]) => {
              const tmpRole = await Role.findOne({ name: role }).lean()
              if (tmpRole) roles.push(tmpRole._id)
              if (idx === arr.length - 1) resolve(roles)
            }
          )
        } else resolve(roles)
      }
    )
    promise.then(async (roles) => {
      console.log({ roles })
      let rolesLocal = roles
      if (!roles.length)
        rolesLocal = [
          (await Role.findOne({ name: 'gamer' }))?._id as Types.ObjectId,
        ]

      const user = new User({
        ...req.body,
        ...{ password: bcrypt.hashSync(req.body.password) },
        ...{ roles: rolesLocal },
      })
      await user.save()
      res.status(201).send(user)
    })
  } catch (err) {
    console.error(err)
    res.status(400).send(err)
  }
})

authRouter.post('/signin', async (req, res) => {
  try {
    const email: string = req.body.email
    const password: string = req.body.password

    const user = await User.findOne({ email })
    if (user) {
      const isPasswordCorrect = user.comparePassword(password)
      const token = jwt.sign({ userId: user._id }, authConfig.secretKey)
      if (isPasswordCorrect) res.status(200).send({ token })
      else res.status(403).send({ message: 'Incorrect password' })
    } else res.status(403).send({ message: 'Incorrect email' })
  } catch (err) {
    console.error(err)
    res.status(400).send(err)
  }
})

export { authRouter }

