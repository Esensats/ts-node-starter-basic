import jwt from 'jsonwebtoken'

import { authConfig as config } from '../config/auth.config.js'
import { User } from '../models/user.js'
import { Role } from '../models/role.js'
import { Request, RequestHandler } from 'express'
import { ObjectId, Schema } from 'mongoose'

export const verifyToken: RequestHandler = (req, res, next) => {
  const tokenWithPrefix = (req.headers['authorization'] as string) || ''

  if (!tokenWithPrefix) {
    return res.status(401).send({ message: 'No token provided!' })
  }
  if (!tokenWithPrefix.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Incorrect token!' })
  }
  const token = tokenWithPrefix.replace('Bearer ', '')
  interface UserJwtPayload extends jwt.JwtPayload {
    uid: ObjectId
  }

  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' })
    }
    const { uid } = decoded as UserJwtPayload
    console.log({ decoded })
    Object.assign(req, { userId: uid })
    next()
  })
}

export const isAdmin: RequestHandler = (req, res, next) => {
  interface UserRequest extends Request {
    userId: Schema.Types.ObjectId
  }
  const { userId } = req as UserRequest
  User.findById(userId)
    .then((user) => {
      if (user) {
        Role.find({
          _id: { $in: user.roles },
        })
          .then((roles) => {
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === 'admin') {
                next()
                return
              }
            }

            res.status(403).send({ message: 'Require Admin Role!' })
            return
          })
          .catch((err: unknown) => {
            if (err) {
              res.status(500).send({ message: err })
              return
            }
          })
      } else {
        res.status(500).send({ message: 'No user found' })
      }
    })
    .catch((err) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
    })
}
/* 
export const isModerator: RequestHandler = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err })
          return
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') {
            next()
            return
          }
        }

        res.status(403).send({ message: 'Require Moderator Role!' })
        return
      }
    )
  })
} */
