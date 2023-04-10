import express from 'express'
import ip from 'ip'
import mongoose from 'mongoose'

const app = express()
app.use(express.json())
const port = process.env.API_PORT || 3000

mongoose.connect('mongodb://127.0.0.1/blog')

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

app.listen(port, () => {
  console.log(`
Server is running

Host:  http://${ip.address()}:${port}/

Local: http://127.0.0.1:${port}/
`)
})
