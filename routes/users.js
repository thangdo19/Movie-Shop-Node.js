const { User, validate } = require('../model/user')
const objectId = require('../middleware/objectId')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.find().select('-__v -password')
  return res.json({
    status: 200,
    data: users
  })
})

router.get('/:id', [objectId], async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v -password')
  if (!user) return res.json({
    status: 404,
    message: 'User not found'
  })
  return res.json({
    status: 200,
    data: user
  })
})

router.post('/', [validate], async (req, res) => {
  // check for existence
  const isExist = await User.exists({ email: req.body.email })
  if (isExist) return res.json({
    status: 400,
    message: 'User already registered'
  })
  // create user
  try {
    // hash password
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
    // create user (trigger validator)
    const user = await User.create(req.body)
    // generate token
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_KEY)
    return res.json({
      status: 200,
      token,
      data: _.pick(user, ['_id', 'email', 'name'])
    })
  }
  catch(ex) {
    console.log(ex)
    return res.json({
      status: 400,
      message: ex.message
    })
  }
})

router.patch('/:id', [validate], async (req, res) => {
  // check for existence
  const isExist = await User.exists({ email: req.body.email })
  if (!isExist) return res.json({
    status: 400,
    message: 'User not found'
  })
  // take info
  const userNewInfo = _.omit(req.body, ['email'])
  // hash password
  if (req.body.password) userNewInfo.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
  // update
  try {
    console.log(req.params.id)
    await User.updateOne({ _id: req.params.id }, userNewInfo, { runValidators: true })
    return res.json({
      status: 200
    })
  }
  catch(ex) {
    console.log(ex)
    return res.json({
      status: 400,
      message: ex.message
    })
  }
})

router.delete('/:id', async (req, res) => {
  // check for existence
  const isExist = await User.exists({ email: req.body.email })
  if (!isExist) return res.json({
    status: 400,
    message: 'User not found'
  })
  // delete
  await User.findByIdAndRemove(req.params.id)
  return res.json({ status: 200 })
})

module.exports = router