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
          {name:'very hard', max:100000}]
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
      return {
        constants: _constants,
        guid:guid
      }
    }]);
