const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')
const config = require('./config/database')

// Connect to database
mongoose.connect(config.database, {useNewUrlParser: true})

// On Connection
mongoose.connection.on('connected', () => {
	console.log('Connected to database ' + config.database)
})

// On error
mongoose.connection.on('error', () => {
	console.log('Database error: ' + config.database)
})

const app = express()

const users = require('./routes/users')

// Port number
const port = 3000

// BodyParser middleware
app.use(bodyParser.json())

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, 'public')))
app.use('/users', cors(), users)
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'))
})

// Index route
app.get('/', function (req, res, next) {
	res.send('Invalid endpoint!')
})

app.listen(port, () => {
	console.log('Server Start at port ' + port)
})
