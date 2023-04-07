import express from 'express'
import * as process from 'process'

const app = express()
app.use(express.json())

const port = process.env.API_PORT || 3000

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

const server = app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`)
})

app.on('exit', () => {
  server.close((err) => {
    console.log('Server closed.')
    process.exit(err ? 1 : 0)
  })
})
