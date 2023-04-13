import { Types } from 'mongoose'
import { Role } from '../models/role.js'
import { User } from '../models/user.js'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authConfig } from '../config/auth.config.js'

export const signup = async (
  req: Request<
    never,
    never,
    { roles: string[]; name: string; email: string; password: string },
    never
  >,
  res: Response
) => {
  try {
    // const roles: Types.ObjectId[] = []
    const asyncFunction = (role: string, cb: (value?: unknown) => void) => {
      Role.findOne({ name: role })
        .lean()
        .then((tmpRole) => {
          // if (tmpRole) roles.push(tmpRole._id)
          if (!tmpRole) {
            cb()
            return
          }
          cb(tmpRole._id)
        })
    }

    const roleRequests = req.body.roles.map(
      (role) => new Promise((resolve) => asyncFunction(role, resolve))
    )

    Promise.all(roleRequests).then(async (roles) => {
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
      const savedUser = await user.save()
      const popUser = await savedUser.populate('roles')
      res.status(201).send(popUser)
    })
  } catch (err) {
    console.error(err)
    res.status(400).send(err)
  }
}

export const signin = async (
  req: Request<never, never, { email: string; password: string }, never>,
  res: Response
) => {
  try {
    const email: string = req.body.email
    const password: string = req.body.password

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(401).send({
        message: 'Invalid email',
        isValid: { email: false, password: null },
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).send({
        message: 'Email not found',
        isValid: { email: false, password: null },
      })
    }

    if (!password) {
      return res.status(401).send({
        message: 'No password provided',
        isValid: { email: true, password: false },
      })
    }

    const isPasswordCorrect = user.comparePassword(password)

    if (!isPasswordCorrect) {
      return res.status(401).send({
        message: 'Incorrect password',
        isValid: { email: true, password: false },
      })
    }
    const token = jwt.sign({ uid: user._id }, authConfig.secretKey)

    res.status(200).send({ token })
  } catch (err) {
    console.error(err)
    res.status(400).send(err)
  }
}

export default { signup, signin }
