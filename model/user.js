const Joi = require('joi')
const mongoose = require('mongoose')
require('mongoose-type-email')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    minlength: 2,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  role: {
    type: String,
    enum: ['ADMIN', 'EMPLOYEE', 'BASIC'],
    default: 'BASIC',
    uppercase: true
  }
})

const User = mongoose.model('User', userSchema)

function validate(req, res, next) {
  const schema = Joi.object().keys({
    name: Joi.string().max(255),
    email: Joi.string().email().max(255),
    password: Joi.string().min(5).max(1024),
    role: Joi.string().optional() // this prop is always optional
  })
  // PATCH method will not require any prop
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({
    status: 400,
    message: error.message
  })
  next()
}

module.exports = {
  User,
  validate
}