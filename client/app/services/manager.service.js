'use strict';

angular.module('sudokuApp')
  .factory('manager',['SudokuSchema','AlgorithmSingleValue','AlgorithmSingleCell',
    function(SudokuSchema,AlgorithmSingleValue,AlgorithmSingleCell) {
      var _options = {
        symmetry:['total','polar','horizontal','vertical','diagonal \\','diagonal /'],
      };

      var _algorithms = [{
        name:'single value',
        instance: new AlgorithmSingleValue()
      },{
        name:'single cell',
        instance: new AlgorithmSingleCell()
      }];

      function solveSchema(schema, step) {
        var done = false;
        do {
          //cerca il primo algoritmo che riesce a risolvere
          var go = _.find(_algorithms, function(alg){
            return alg.apply(schema);
          });
          if (go){
            //verifica la completezza dello schema oppure
            //la richiesta di stop sullo step
            done = step || schema.isComplete();
          } else {
            //nessun algoritmo produce risultato
            //non risolvibile...
            done = true;
          }

        } while(done);
      }

      function solve(schema, step) {
        var solver = new SolverSchema(schema);
        return solveSchema(solver);
      }

      return {
        options:_options,
        solve:solve
      }
    }]);
