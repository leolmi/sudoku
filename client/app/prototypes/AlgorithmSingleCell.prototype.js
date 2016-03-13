'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmSingleCell',['Algorithm',
    function(Algorithm) {

      function getValuesContainer(schema) {
        var values = [];
        for(var i=0;i<schema.dimension;i++)
          values.push([]);
        return values;
      }

      /**
       * Celle uniche per il valore (il gruppo contiene quel valore solo in quella cella)
       * @param info
       * @constructor
       */
      var AlgorithmSingleCell = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmSingleCell.prototype = new Algorithm('singlecell');

      AlgorithmSingleCell.prototype.apply = function(schema, forks) {
        var self = this;
        if (schema.report.length==29) {
          var l = schema.report.length;
        }
        return _.find(schema.groups, function(g){
          var values = getValuesContainer(schema);
          g.cells.forEach(function(c){
            c.available.forEach(function(v){
              values[v-1].push(c);
            });
          });
          var value = 0;
          var result = _.find(values, function(v, i){
            value = i+1;
            return v.length == 1;
          });
          if (result) {
            result[0].setValue(value);
            schema.log(self, result[0]);
          }
          return result ? true : false;
        });
      };

      return (AlgorithmSingleCell);
    }]);
