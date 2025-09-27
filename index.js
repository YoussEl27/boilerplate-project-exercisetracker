const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let nexId = 1;
let users = []
let exercises = []

app.use(express.urlencoded({extended: true}));

app.post('/api/users', function (req, res) {
  const username = req.body.username
  let id = nexId++;

  users.push({
    username: username,
    _id:id.toString()
  })

  res.json({
    username: username,
    _id:id
  })
})

app.get('/api/users',  function (req, res) {
  res.send(users)
})

app.post('/api/users/:_id/exercises',  function (req, res) {
  const id = req.params._id
  let user = users.find(user => user._id === id)
  const description = req.body.description
  const duration = req.body.duration
  let date = req.body.date

  if (!date) {
    date = new Date()
  }

  if (user) {
    exercises.push({
      _id: id,
      username: user.username,
      description: description,
      duration: Number(duration),
      date: date.toDateString(),
    })

    console.log(exercises)

    res.json({
      _id: id,
      username: user.username,
      date: date.toDateString(),
      duration: Number(duration),
      description: description,
    })
  }
  else {
    res.json({error: 'User not found'})
  }
})

app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id

  let user = users.find(user => user._id === id)
  if(!user) return res.json({error: 'Invalid User'})

  let user_log = exercises.filter(user => Number(user._id) === Number(id))
      .map(({ description, duration, date }) => ({ description, duration, date }))


  const count = user_log.length

  res.json({
    _id: id,
    username: user.username,
    count: count,
    log: user_log,
  })

})

const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
