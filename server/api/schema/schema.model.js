'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const SchemaReportLine = new Schema({
  alg: String,
  score: Number,
  value: Number,
  values: [Number],
  index: Number
});

const SchemaSchema = new Schema({
  name: String,
  symmetry: String,
  dimension: Number,
  x: Boolean,
  values: String,
  score: Number,
  report: [SchemaReportLine],
  meta: Schema.Types.Mixed
});

module.exports = mongoose.model('Schema', SchemaSchema);
