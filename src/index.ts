import express from 'express'
import ip from 'ip'
import mongoose from 'mongoose'
import { router } from './router.js';
import path from 'path';

const app = express()
app.use(express.json())

// Use User router
app.use('/api', router);

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, '../../frontend/dist')))

const port = process.env.API_PORT || 3000
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/main'

mongoose.connect(mongoUri).then(() => {
  console.log(`Connected to MongoDB at ${mongoUri}`)
}).catch((err)=>{
  console.error('Error connecting to MongoDB', err)
})

app.get('/', (req, res) => {
  res.send('Hello world!')
})

/* app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  res.send(user);
}); */

app.listen(port, () => {
  console.log(`
Server is running

Host:  http://${ip.address()}:${port}/

Local: http://127.0.0.1:${port}/
`)
})

