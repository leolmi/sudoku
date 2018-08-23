'use strict';

const u = require('../utilities/util');
const _ = require('lodash');
const Schema = require('./schema.model');

// Get list of schemas
exports.index = function(req, res) {
  return u.index(Schema, req, res);
};

// Get one schema
exports.show = function(req, res) {
  return u.get(Schema, req, res);
};

// Updates an existing schema in the DB.
exports.save = function(req, res) {
  return u.save(Schema, req, res);
};

// Deletes a schema from the DB.
exports.destroy = function(req, res) {
  return u.destroy(Schema, req, res);
};

// Generate one or more schemas
exports.generate = function(req, res) {
  //TODO: generazione di schemi sudoku
  // - validazione parametri di input (opzioni)
  // - generazione di token di risoluzione
  // - avvio procedura di generazione
};
