'use strict';

angular.module('sudokuApp')
  .factory('util',[
    function() {
      const _constants = {
        symmetries:['none','total','polar','horizontal','vertical','diagonalNWSE','diagonalNESW'],
        scores:[
          {name:'unknown', max:1},
          {name:'very easy', max:80},
          {name:'easy', max:100},
          {name:'middle', max:140},
          {name:'hard', max:200},
          {name:'very hard', max:100000}],
        stopTypes:['manual','after']
      };

      /**
       * Generate new GUID
       * @returns {string}
       */
      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      /**
       * Rimuove gli elementi che soddisfano il predicato
       * @param {Array} array
       * @param {Function} predicate
       * @returns {Array}
       */
      function remove(array, predicate) {
        var e = null;
        do {
          if (e)
            array.splice(array.indexOf(e), 1);
          e = _.find(array, predicate);
        } while (e);
      }

      /**
       * Apply checking $digest
       * @param scope
       * @param fn
       */
      function safeApply(scope, fn) {
        var phase = scope.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
          if (fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          scope.$apply(fn);
        }
      }

      function sanitize(o) {
        if (!_.isObject(o)) return o;
        let r = _.clone(o);
        for (var pn in r) {
          if (pn.indexOf('_') === 0 || pn.indexOf('$$') === 0 || _.isFunction(r[pn])) {
            delete r[pn];
          } else if (_.isArray(r[pn])) {
            r[pn] = _.map(r[pn], function(i){
              return sanitize(i);
            });
          } else if (_.isObject(r[pn])) {
            r[pn] = sanitize(r[pn]);
          }
        }
        return r;
      }

      function validateFileName(name) {
        return (name||'file').replace(/[\\\/:\*\?"<>\|\s]/gi, '_');
      }

      /**
       * Salva il file con il nome specificato
       * @param {string} content
       * @param {string} [filename]
       * @param {string} [type]
       */
      function saveFile(content, filename, type) {
        filename = validateFileName(filename || 'content.txt');
        type = type || 'text/plain;charset=utf-8';
        const file = new File([content], filename, {type: type});
        saveAs(file);
      }

      function isJson(txt) {
        return _.startsWith((txt||'').trim(), '{');
      }

      function toString(v, trim) {
        if (_.isNaN(v) || _.isUndefined(v) || _.isNull(v)) return '';
        if (_.isString(v)) return v;
        if (v && _.isFunction(v.toString))
          return v.toString();
        return trim ? (''+v).trim() : ''+v;
      }

      /**
       * Effettua la replace dei valori forniti tramite elenco o oggetto nella stringa
       * @param {string} str
       * @param {[]|object} args
       * @param {object} [o]
       */
      function format(str, args, o) {
        if (args && _.isArray(args)) {
          args.forEach(function (v, i) {
            const rgx = new RegExp('\\{' + i + '\\}', 'g');
            str = str.replace(rgx, toString(v));
          });
        }
        else if (args && _.isObject(args)) {
          o = args;
        }
        if (o && _.isObject(o)) {
          for(let pn in o) {
            const rgx = new RegExp('\\{'+pn+'\\}', 'g');
            str = str.replace(rgx, toString(o[pn]));
          }
        }
        return str;
      }

       function hash(txt) {
        let hash = 0, i, chr;
        if (txt.length === 0) return hash;
        for (i = 0; i < txt.length; i++) {
          chr   = txt.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0;
        }
        return hash;
      }

      function objToArray(o) {
        const list = [];
        for(var s in o) list.push(s);
        return list;
      }

      return {
        constants: _constants,
        guid: guid,
        sanitize: sanitize,
        safeApply: safeApply,
        remove: remove,
        validateFileName: validateFileName,
        saveFile: saveFile,
        isJson: isJson,
        toString: toString,
        format: format,
        hash: hash,
        objToArray: objToArray
      }
    }]);
