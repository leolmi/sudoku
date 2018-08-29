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
        const self = this;
        if (!forks) return false;
        const cells = [];
        const twins = schema.getTwins();
        if (schema.isCorrupted()) return false;
        // RICERCA le celle con minor numero di valori possibili
        // se trova dei gemelli usa quelli
        if (twins.length) {
          cells.push(twins[0].cells[0]);
        } else {
          const mincell = schema.getMinAvailable();
          if (!mincell) return false;
          cells.push(mincell);
        }

        if (cells.length) {
          cells.forEach(function(cell) {
            forksOnCell(self, schema, cell, forks);
          });
          const last = forks.pop();
          const cell = cells[cells.length-1];
          const index = schema.cells.indexOf(cell);
          cell.setValue(last.cells[index].value);
          schema.log(self, cell);
          return true;
        }
        return false;
      };

      return (AlgorithmTry);
    }]);
