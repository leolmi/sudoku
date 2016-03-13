'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SchemaReportLine = new Schema({
  alg: String,
  score: Number,
  value: Number,
  values: [Number],
  index: Number
});

var SchemaSchema = new Schema({
  symmetry: String,
  dimension: Number,
  x: Boolean,
  values: String,
  score: Number,
  report: [SchemaReportLine]
});

module.exports = mongoose.model('Schema', SchemaSchema);
