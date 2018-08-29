'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmSingleValue',['Algorithm',
    function(Algorithm) {
      /**
       * Valori unici per le celle (la cella contiene quell'unico valore possibile)
       * @param info
       * @constructor
       */
      const AlgorithmSingleValue = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmSingleValue.prototype = new Algorithm('singlevalue');

      AlgorithmSingleValue.prototype.apply = function(schema, forks) {
        const self = this;
        return _.find(schema.cells, function (c) {
          const result = (c.available.length === 1 && !c.value);
          if (result) {
            c.setValue(c.available[0]);
            schema.log(self, c);
          }
          return result;
        });
      };

      return (AlgorithmSingleValue);
    }]);
