'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmTry',['Algorithm','SudokuSchema',
    function(Algorithm, SudokuSchema) {

      function forksOnCell(alg, schema, cell, forks) {
        var index = schema.cells.indexOf(cell);
        cell.available.forEach(function(v){
          var clone = new SudokuSchema();
          clone.cloneBy(schema);
          clone.cells[index].setValue(v);
          clone.log(alg, clone.cells[index]);
          forks.push(clone);
        });
      }



      /**
       * Avanza per tentativi:
       * scelta la prima cella con minor numero di valori possibili (n)
       * genera n schemi uno per valore e tenta la risoluzione di ognuno di questi.
       * @param info
       * @constructor
       */
      var AlgorithmTry = function (info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmTry.prototype = new Algorithm('try');

      AlgorithmTry.prototype.apply = function (schema, forks, best) {
        var self = this;
        if (!forks) return false;
        var cells = [];
        var twins = schema.getTwins();
        if (twins.length) {
          cells.push(twins[0].cells[0]);
        } else {
          cells.push(schema.getMinAvailable());
        }

        if (cells.length) {
          cells.forEach(function(cell) {
            forksOnCell(self, schema, cell, forks);
          });
          var last = forks.pop();
          var cell = cells[cells.length-1];
          var index = schema.cells.indexOf(cell);
          cell.setValue(last.cells[index].value);
          return true;
        }
        return false;
      };

      return (AlgorithmTry);
    }]);
