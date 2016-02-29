'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmSingleValue',['Algorithm',
    function(Algorithm) {
      /**
       * Valori unici per le celle (la cella contiene quell'unico valore possibile)
       * @param info
       * @constructor
       */
      var AlgorithmSingleValue = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmSingleValue.prototype = new Algorithm();

      AlgorithmSingleValue.prototype.apply = function(schema) {
        return _.find(schema.cells, function (c) {
          var result = (c.available.length == 1 && !c.value);
          if (result)
            c.value = c.available[0];
          return result;
        });
      };

      return (AlgorithmSingleValue);
    }]);
