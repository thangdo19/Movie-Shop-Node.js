const mongoose = require('mongoose')
const morgan = require('morgan')
const express = require('express')
const app = express()
require('dotenv').config()
// require routes
// const error = require('./')
const users = require('./routes/users')
// check for jwt private key
if (!process.env.JWT_KEY) {
  console.log('FATAL ERROR: JWT_KEY is not provided')
  process.exit(1)
}
// handle uncaughtException & unhandledRejection
process.on('uncaughtException', (ex) => {
  console.log(ex)
  process.exit(1)
})
process.on('unhandledRejection', (ex) => { throw ex })
// middleware
app.use(express.json())
app.use(morgan('dev'))
// routes
app.use('/api/users', users)
// // handling error in routes
// app.use()
// connect db
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
  .then(() => console.log('Connected to db'))
// eslint-disable-next-line
app.listen(port = (process.env.PORT || 3000), () => console.log(`Listening on port ${port}...`))