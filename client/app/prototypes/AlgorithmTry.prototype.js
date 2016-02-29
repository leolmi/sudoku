'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmTry',['Algorithm',
    function(Algorithm) {
      /**
       *
       * @param info
       * @constructor
       */
      var AlgorithmTry = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmTry.prototype = new Algorithm();

      AlgorithmTry.prototype.apply = function(schema) {
        //TODO ....
        return false;
      };

      return (AlgorithmTry);
    }]);
