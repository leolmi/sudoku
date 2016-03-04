'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmTry',['Algorithm','SudokuSchema',
    function(Algorithm, SudokuSchema) {
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

      AlgorithmTry.prototype.apply = function (schema, forks) {
        var self = this;


        //TODO: DA RIVEDERE: prima cerca i gemelli, se li trova parte valorizzando questi!!!



        //1. ricerca la prima cella con elenco di valori possibili più piccolo
        var source = undefined;
        schema.cells.forEach(function (c, i) {
          if (!c.value && (!source || source.available.length > c.available.length))
            source = c;
        });
        var availables = source.available.slice(0);
        if (availables.length < 2) return false;
        var index = schema.cells.indexOf(source);


        if (!forks) return false;
        //2. genera un numero di fork dato dal numero di valori possibili della cella -1 (lo schema origine)
        for (var i = 1; i < availables.length; i++) {
          var clone = new SudokuSchema();
          clone.cloneBy(schema);
          forks.push(clone)
        }

        //3. valorizza ogni schema, nella cella individuata, con il valore possibile scelto
        availables.forEach(function (v, i) {
          if (i == 0) {
            source.setValue(availables[i]);
            schema.log(self, source);
          }
          else {
            forks[i - 1].cells[index].setValue(availables[i]);
            forks[i - 1].log(self, forks[i - 1].cells[index]);
          }
        });

        return true;
      };

      return (AlgorithmTry);
    }]);
