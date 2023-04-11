import { ErrorRequestHandler } from 'express'
import { Error } from 'mongoose'

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  next
) => {
  console.error(err.stack)
  res.status(400).send('Something broke! ' + err.message)
}

