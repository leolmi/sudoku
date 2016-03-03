'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmIntersections',['Algorithm',
    function(Algorithm) {
      /**
       *
       * @param info
       * @constructor
       */
      var AlgorithmIntersections = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmIntersections.prototype = new Algorithm();

      AlgorithmIntersections.prototype.apply = function(schema, forks) {
        //TODO ....
        //allineamenti nel gruppo che permettono di escludere possibili valori su altri gruppi
        return false;
      };

      return (AlgorithmIntersections);
    }]);
