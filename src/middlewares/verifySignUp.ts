import { User } from '../models/user.js'
import { ROLES } from '../models/role.js'
import { RequestHandler } from 'express'

export const checkDuplicateUsernameOrEmail: RequestHandler = (
  req,
  res,
  next
) => {
  // Username
  User.findOne({
    username: req.body.username,
  })
    .exec()
    .then((user) => {
      if (user) {
        res.status(400).send({ message: 'Failed! Username is already in use!' })
        return
      }

      // Email
      User.findOne({
        email: req.body.email,
      })
        .exec()
        .then((user) => {
          if (user) {
            res
              .status(400)
              .send({ message: 'Failed! Email is already in use!' })
            return
          }
          next()
        })
        .catch((err) => {
          res.status(500).send({ message: err })
        })
    })
    .catch((err) => {
      res.status(500).send({ message: err })
    })
}

export const checkRolesExisted: RequestHandler = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        })
        return
      }
    }
  }

  next()
}
