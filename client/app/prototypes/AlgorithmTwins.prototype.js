'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmTwins',['Algorithm',
    function(Algorithm) {
      /**
       * Algoritmo di esclusione di valori:
       * se esistono due coppie o tre terzine, e così via .. con gli stessi
       * numeri, questi vengono tolti dalle possibilità di tutte le altre celle
       * del gruppo
       * @param info
       * @constructor
       */
      var AlgorithmTwins = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmTwins.prototype = new Algorithm('twins');

      AlgorithmTwins.prototype.apply = function(schema, forks) {
        var self = this;
        var result = false;

        var twins = schema.getTwins();
        twins.forEach(function(twin){
          // toglie dai gemelli i valori in più
          twin.cells.forEach(function(c){
            var others = _.difference(c.available, twin.values);
            if (schema.checkValues(self, c, others)) result = true;
          });

          // toglie dalle altre celle dei gruppi che contengono
          // entrambi i gemelli i valori
          schema.getGroups(twin.cells).forEach(function(g){
            g.cells.forEach(function(c){
              // se non è una cella dei gemelli
              if (!c.value && twin.cells.indexOf(c)<0) {
                //esclude i valori dei gemelli
                if (schema.checkValues(self, c, twin.values)) result = true;
              }
            });
          });
        });
        return result;
      };

      return (AlgorithmTwins);
    }]);
