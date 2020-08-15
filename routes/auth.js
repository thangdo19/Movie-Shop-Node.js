const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const { User } = require('../model/user')

router.post('/', [validate], async (req, res) => {
  // find user
  const user = await User.findOne({ email: req.body.email }).select('_id password role')
  if (!user) return res.json({
    status: 400,
    message: 'Invalid email or password'
  })
  // compare password
  const areEqual = await bcrypt.compare(req.body.password, user.password)
  if (!areEqual) return res.json({
    status: 400,
    message: 'Invalid email or password'
  })
  // generate token & response
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_KEY)
  return res.json({
    status: 200,
    token
  })
})

// auth validation middleware
function validate(req, res, next) {
  const schema = Joi.object().keys({
    email: Joi.string().email().min(9).max(255),
    password: Joi.string().min(5).max(1024)
  })
  const { error } = schema.validate(req.body, { presence: 'required', abortEarly: false })
  if (error) return res.json({
    status: 400,
    message: error.message
  })
  next()
}

module.exports = router