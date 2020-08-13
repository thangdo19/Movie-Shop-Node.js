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
  const genre = await Genre.findById(req.params.id)
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

module.exports = router
