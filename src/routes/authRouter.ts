import express from 'express'

const authRouter = express.Router()

authRouter.get('/login', function (req, res, next) {
  res.render('login')
})

export { authRouter }
