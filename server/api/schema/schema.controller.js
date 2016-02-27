'use strict';

var u = require('../utilities/util');
var _ = require('lodash');
var Schema = require('./schema.model');

// Get list of schemas
exports.index = function(req, res) {
  return u.index(Schema, req, res);
};

// Get one schema
exports.show = function(req, res) {
  return u.get(Schema, req, res);
};

// Generate one or more schemas
exports.generate = function(req, res) {
  //TODO: ....
};

// Updates an existing schema in the DB.
exports.update = function(req, res) {
  //TODO: ....
};

// Deletes a schema from the DB.
exports.destroy = function(req, res) {
  //TODO: ....
};
