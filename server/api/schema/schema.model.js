'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SchemaSchema = new Schema({
  symmetry: String,
  type: String,
  values: String,
  score: Number
});

module.exports = mongoose.model('Schema', SchemaSchema);
