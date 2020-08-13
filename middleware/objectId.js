const mongoose = require('mongoose')

module.exports = function(req, res, next) {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id)
  if (!isValid) return res.json({
    status: 400,
    message: 'Invalid id'
  })
  // valid id => pass to the next middleware
  next()
}