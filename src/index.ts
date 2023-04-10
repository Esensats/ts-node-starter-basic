import express from 'express'
import ip from 'ip'
import mongoose from 'mongoose'
import { User } from './models/user.js'

const app = express()
app.use(express.json())
const port = process.env.API_PORT || 3000
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/main'

mongoose.connect(mongoUri).then(() => {
  console.log(`Connected to MongoDB at ${mongoUri}`)
}).catch((err)=>{
  console.error(err)
})

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/articles', (req, res) => {
  res.send({
    articles: [
      {
        id: 0,
        title: 'Cookies recipe',
        description:
          'Do you want to know how to cook the best cookies you ever tasted? Read this article!',
        text: `<p>Get dough, get chocolate, mix it, bake. Done!\n\nEnjoy your meal.</p>`,
      },
    ],
  })
})

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  res.send(user);
});

app.listen(port, () => {
  console.log(`
Server is running

Host:  http://${ip.address()}:${port}/

Local: http://127.0.0.1:${port}/
`)
})

