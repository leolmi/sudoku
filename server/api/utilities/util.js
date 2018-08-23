'use strict';
/*
 200 OK
 Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request the response will contain an entity describing or containing the result of the action.

 201 Created
 The request has been fulfilled and resulted in a new resource being created.

 202 Accepted
 The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place.

 203 Non-Authoritative Information (since HTTP/1.1)
 The server successfully processed the request, but is returning information that may be from another source.

 204 No Content
 The server successfully processed the request, but is not returning any content. Usually used as a response to a successful delete request.

 205 Reset Content
 The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.

 206 Partial Content
 The server is delivering only part of the resource (byte serving) due to a range header sent by the client. The range header is used by tools like wget to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.

 207 Multi-Status (WebDAV; RFC 4918)
 The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.[4]

 208 Already Reported (WebDAV; RFC 5842)
 The members of a DAV binding have already been enumerated in a previous reply to this request, and are not being included again.

 226 IM Used (RFC 3229)
 */

const _ = require('lodash');
const noop = function() {};
exports.noop = noop;


/**
 * Return standard 200
 * @param res
 * @param obj
 * @param cb
 * @returns {*}
 */
const ok = function(res, obj, cb) {
  cb = cb || noop;
  res.json(200, obj);
  return cb(obj);
};
exports.ok = ok;

/**
 * Return standard 201
 * @param res
 * @param obj
 * @param cb
 * @returns {*}
 */
const created = function(res, obj, cb) {
  cb = cb || noop;
  res.json(201, obj);
  return cb(obj);
};
exports.created = created;

/**
 * Return standard 204
 * @param res
 * @param obj
 * @param cb
 * @returns {*}
 */
const deleted = function(res, obj, cb) {
  cb = cb || noop;
  res.json(204);
  return cb(obj);
};
exports.deleted = deleted;

/**
 * Return standard 404
 * @param res
 * @returns {*}
 */
const notfound = function(res) {return res.send(404); };
exports.notfound = notfound;

/**
 * Return standard 500
 * @param res
 * @param err
 * @returns {*}
 */
var error = function(res, err) {
  //if (_.isString(err))
  //  err = new Error(err);
  return res.send(500, err);
};
exports.error = error;

/**
 * Effettua il log su console
 * @param message
 * @param err
 */
const log = function(message, err) {
  var errmsg = '';
  if (err && typeof err === 'string') errmsg = err;
  else if (err) errmsg = JSON.stringify(err);
  console.log(message + ' ' + errmsg);
};
exports.log = log;



const create = function(schema, req, res, cb) {
  cb = cb || noop;
  schema.create(req.body, function(err, obj) {
    if(err) { return error(res, err); }
    return created(res, obj, cb);
  });
};
exports.create = create;


/**
 * Aggiorna l'elemento ricercato per id
 * @param schema
 * @param req
 * @param res
 * @param {Function} customize
 * @param {Function} cb
 * @param {Boolean} [verbose]
 */
exports.update = function(schema, req, res, customize, cb, verbose) {
  if (verbose) console.log('[UPDATE] - body: ' + JSON.stringify(req.body));
  if (req.body._id) {
    delete req.body._id;
  }
  if (verbose) console.log('[UPDATE] - params: ' + JSON.stringify(req.params));
  schema.findById(req.params.id, function (err, obj) {
    if (err) {
      if (verbose) console.log('[UPDATE.ERROR] Schema dati: "' + schema.modelName + '", ' + err.message);
      return error(res, err);
    }
    if (!obj) {
      return notfound(res);
    }
    if (verbose) console.log('[UPDATE] - before merge: ' + JSON.stringify(obj));
    var updated = _.merge(obj, req.body, function (a, b) {
      return _.isArray(a) ? b : undefined;
    });
    updated.__v = obj.__v;
    if (customize)
      customize(updated);
    if (verbose) console.log('[UPDATE] - after merge: ' + JSON.stringify(updated));
    updated.save(function (err) {
      if (err) {
        if (verbose) console.log('[UPDATE.MONGO.ERROR] - save: ' + err.message);
        return error(res, err);
      }
      return ok(res, obj, cb);
    });
  });
};

/**
 * Salva o crea l'elemento
 * @param schema
 * @param req
 * @param res
 * @param {Function} customize
 * @param {Function} cb
 * @param {Boolean} [verbose]
 */
exports.save = function(schema, req, res, customize, cb, verbose) {
  cb = cb || noop;
  if (!!verbose) console.log('[SAVE] - body: ' + JSON.stringify(req.body));
  const o = req.body;
  if (!_.isObject(o)) return error(res, 'Undefined object to save!');
  if (!o._id) return create(schema, req, res, cb);
  schema.findById(o._id, function (err, obj) {
    if (err) {
      if (!!verbose) console.log('[SAVE.ERROR] Schema dati: "' + schema.modelName + '", ' + err.message);
      return error(res, err);
    }
    if (!obj) return create(schema, req, res, cb);
    if (!!verbose) console.log('[SAVE] - before merge: ' + JSON.stringify(obj));
    const updated = _.merge(obj, o, function (a, b) {
      return _.isArray(a) ? b : undefined;
    });
    updated.__v = obj.__v;
    if (customize)
      customize(updated);
    if (!!verbose) console.log('[SAVE] - after merge: ' + JSON.stringify(updated));
    updated.save(function (err) {
      if (err) {
        if (!!verbose) console.log('[SAVE.MONGO.ERROR] - save: ' + err.message);
        return error(res, err);
      }
      return ok(res, obj, cb);
    });
  });
};

exports.destroy = function(schema, req, res, cb) {
  schema.findById(req.params.id, function (err, obj) {
    if(err) { return error(res, err); }
    if(!obj) { return notfound(res); }
    obj.remove(function(err) {
      if(err) { return error(res, err); }
      return deleted(res, obj, cb);
    });
  });
};

exports.get = function(schema, req, res) {
  schema.findById(req.params.id, function (err, obj) {
    if(err) { return error(res, err); }
    if(!obj) { return notfound(res); }
    return res.json(obj);
  });
};

exports.index = function(schema, req, res) {
  schema.find(function (err, objs) {
    console.log('Trovati: '+objs.length+' elementi di tipo "'+schema.modelName+'".');
    if(err) { return error(res, err); }
    return ok(res, objs);
  });
};
