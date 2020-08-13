const { Genre, validate } = require('../model/genre')
const objectId = require('../middleware/objectId')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const genres = await Genre.find().select('-__v')
  return res.json({
    status: 200,
    data: genres
  })
})

router.get('/:id', [objectId], async (req, res) => {
  const genre = await Genre.findById(req.params.id).select('-__v')
  if (!genre) return res.json({
    status: 404,
    message: 'Genre not found'
  })
  return res.json({
    status: 200,
    data: genre
  })
})

router.post('/', [validate], async (req, res) => {
  // check for existence
  const isExist = await Genre.exists({ name: req.body.name })
  if (isExist) return res.json({
    status: 400,
    message: 'Genre already added'
  })
  // create genre
  try {
    const genre = await Genre.create(req.body)
    return res.json({
      status: 201,
      data: genre
    })
  }
  catch(ex) {
    console.log(ex.message)
    return res.json({
      status: 400,
      message: ex.message
    })
  }
})

router.patch('/:id', [objectId, validate], async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
    // genre not exists
    if (!genre) return res.json({
      status: 404,
      message: 'Genre not found'
    })
    // updated
    return res.json({
      status: 200,
      data: genre
    })
  }
  catch(ex) {
    console.log(ex.message)
    return res.json({
      status: 400,
      message: ex.message
    })
  }
})

router.delete('/:id', [objectId], async (req, res) => {
  // delete in db
  const result = await Genre.deleteOne({ _id: req.params.id })
  // case genre not found
  if (result.n === 0) return res.json({
    status: 404,
    message: 'Genre not found'
  })
  // genre found and deletedCount >= 0
  return res.json({ status: 200 })
})

module.exports = router
