'use strict';

angular.module('sudokuApp')
  .factory('util',[
    function() {
      var _constants = {
        symmetries:['none','total','polar','horizontal','vertical','diagonal \\','diagonal /'],
        scores:[
          {name:'unknown', max:1},
          {name:'very easy', max:80},
          {name:'easy', max:100},
          {name:'middle', max:160},
          {name:'hard', max:240},
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



      return {
        constants: _constants,
        guid:guid,
        remove:remove
      }
    }]);
