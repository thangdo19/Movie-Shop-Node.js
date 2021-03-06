const Joi = require('joi')
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    uppercase: true,
    required: true,
    maxlength: 255
  }
})

const Genre = mongoose.model('Genre', genreSchema)

function validate(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255)
  })
  // required for POST & PUT
  const { error } = schema.validate(req.body, { 
    presence: (req.method !== 'PATCH') ? 'required' : 'optional' 
  })
  if (error) return res.json({
    status: 400,
    message: error.message
  })
  next()
}

module.exports = {
  Genre,
  validate
}