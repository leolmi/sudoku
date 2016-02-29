'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmSingleCell',['Algorithm',
    function(Algorithm) {
      /**
       * Celle uniche per il valore (il gruppo contiene quel valore solo in quella cella)
       * @param info
       * @constructor
       */
      var AlgorithmSingleCell = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmSingleCell.prototype = new Algorithm();

      AlgorithmSingleCell.prototype.apply = function(schema) {
        var values = [];
        for(var i=0;i<schema.dimension;i++)
          values.push([]);
        schema.cells.forEach(function(c){
          c.available.forEach(function(v){
            values[v].push(c);
          });
        });
        return _.find(values, function(v, i){
          var result = (v.length==1);
          if (result)
            v[0].value = i;
          return result;
        });
      };

      return (AlgorithmSingleCell);
    }]);
