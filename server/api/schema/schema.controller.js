'use strict';

const u = require('../utilities/util');
const _ = require('lodash');
const Schema = require('./schema.model');
const tesseract = require('tesseract.js');

// Get list of schemas
exports.index = function(req, res) {
  return u.index(Schema, req, res);
};

// Get one schema
exports.show = function(req, res) {
  return u.get(Schema, req, res);
};

function _calcSchemaId(schema) {
  return (_.isString((schema || {}).values) && schema.values.length > 10) ? u.hash(schema.values) : null;
}

// Updates an existing schema in the DB.
exports.save = function(req, res) {
  const schema = req.body;
  if (!schema) return u.error(res, 'Undefined schema!');
  console.log('TRY to save schema', schema);
  schema._id = _calcSchemaId(schema);
  if (!schema._id) return  u.error(res, 'Corrupted schema!');
  Schema.findOne({_id: schema._id}, function (err, xschema) {
    //if (err) console.log('SAVE: error=', err);
    if (err) return u.error(res, err);
    if (!!xschema) return u.error(res, 'Schema already present! (' + schema.values + ')');
    return u.save(Schema, req, res);
  });
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

exports.recognize = function(req, res) {
  if (!req.body.fileData) return u.error(res, 'undefined image data!');
  console.log('RECOGNIZED BODY', req.body);
  const bf = [];
  for(var d in req.body.fileData) {bf.push(req.body.fileData[d]);}
  const data = new Buffer(bf);
  console.log('BODY BUFFER', data);
  try {
    tesseract.detect(data)
      .catch(function (err) {
        console.error(err);
        u.error(res, err);
      })
      .progress(function (info) {
        console.log(info);
      })
      .then(function (data) {
        console.log('done', data);
        u.ok(res, data);
        process.exit();
      });
  } catch(err) {
    console.error(err);
    u.error(res, err);
  }
};
