const { User, validatePost, validatePatch } = require('../model/user')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.find().select('-__v -password')
  return res.json({
    status: 200,
    data: users
  })
})

router.post('/', [validatePost], async (req, res) => {
  // check for existence
  const isExist = await User.exists({ email: req.body.email })
  if (isExist) return res.json({
    status: 400,
    message: 'User already exists'
  })
  // create user
  try {
    // hash password
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
    // create user (trigger validator)
    const user = await User.create(req.body)
    return res.json({
      status: 200,
      data: user
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

router.patch('/:id', [validatePatch], async (req, res) => {
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
  return res.json({
    status: 200
  })
})

module.exports = router