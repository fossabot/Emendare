const mongoose = require('mongoose')

const model = mongoose.model(
  'Amend',
  new mongoose.Schema({
    created: { type: Date, default: Date.now },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    patch: { type: String, required: true },
    version: { type: Number, required: true },
    text: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Text',
      required: true
    },
    upVotesCount: { type: Number, default: 0 },
    downVotesCount: { type: Number, default: 0 },
    accepted: { type: Boolean, default: false }
  })
)

module.exports = class Amend {
  static get model() {
    return model
  }
}
