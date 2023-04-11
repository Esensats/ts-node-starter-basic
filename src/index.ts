import express from 'express'
import ip from 'ip'
import mongoose from 'mongoose'
import { userRouter } from './routes/userRouter.js'
import { Role, ROLES } from './models/role.js'
import { roleRouter } from './routes/roleRouter.js'
// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';

const app = express()
app.use(express.json())

// Use User router
app.use('/api/v1', userRouter)
app.use('/api/v1', roleRouter)

// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// const __dirname = dirname(fileURLToPath(import.meta.url));
// app.use(express.static(path.join(__dirname, '../../frontend/dist')))

const port = process.env.API_PORT || 3000
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/main'

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(`Connected to MongoDB at ${mongoUri}`)
    initial()
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err)
    process.exit()
  })

function initial() {
  Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        ROLES.forEach((role) => {
          new Role({
            name: role,
          })
            .save()
            .then(() => console.log(`added '${role}' to roles collection`))
            .catch((err) => console.error(err))
        })
      }
    })
    .catch((err) => {
      console.error(err)
      throw new Error(err)
    })
}

app.listen(port, () => {
  console.log(`
Server is running

Host:  http://${ip.address()}:${port}/

Local: http://127.0.0.1:${port}/
`)
})
