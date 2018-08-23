'use strict';

const Schema = require('./schema.model');

exports.register = function(socket) {
  Schema.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Schema.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('schema:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('schema:remove', doc);
}
