import jwt from 'jsonwebtoken'

import { authConfig as config } from '../config/auth.config.js'
import { User } from '../models/user.js'
import { Role } from '../models/role.js'
import { RequestHandler } from 'express'

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = (req.headers['x-access-token'] as string) || ''

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' })
  }

  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' })
    }
    req.userId = decoded?.id
    next()
  })
}

export const isAdmin: RequestHandler = (req, res, next) => {
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
          if (roles[i].name === 'admin') {
            next()
            return
          }
        }

        res.status(403).send({ message: 'Require Admin Role!' })
        return
      }
    )
  })
}

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
}
