'use strict';

angular.module('sudokuApp')
  .factory('manager',['SudokuSchema','$injector','algorithms',
    function(SudokuSchema,$injector,algorithms) {

      var _algorithms = _.map(algorithms.availableAlgorithms, function(a){
        var ctor = $injector.get(a.proto);
        return new ctor(a);
      });

      /**
       * Vero se gli/lo schemi passati sono tutti completati
       * @param {array|object} schemas
       * @returns {boolean}
       */
      function areComplete(schemas) {
        if (!schemas) return false;
        if (!_.isArray(schemas)) schemas = [schemas];
        return !_.find(schemas, function(s){
          return !s.isCorreptedOrComplete();
        });
      }

      /**
       * Risolve lo schema restituendo tutte le possibili soluzioni
       * @param schema
       * @param step
       * @returns {*}
       */
      function solve(schema) {
        if (!schema) return false;
        schema.disableLog = false;
        var schemas = [schema];
        return solveSchemas(schemas);
      }

      /**
       * Risolve tutti gli schemi autogenerati
       * @param schemas
       * @returns {Array}
       */
      function solveSchemas(schemas) {
        do {
          var forks = [];
          schemas.forEach(function(s){
            //cerca il primo algoritmo che riesce a risolvere
            _.find(_algorithms, function(alg){
              return alg.apply(s, forks);
            });
          });
          if (forks.length>0)
            Array.prototype.push.apply(schemas, forks);
        } while(!areComplete(schemas));
        //restituisce l'elenco degli schemi completati
        return _.filter(schemas, function(s) { return s.isComplete(); });
      }

      /**
       * Risolve il passo successivo dello schema
       * @param schema
       */
      function solveStep(schema) {
        schema.disableLog = true;
        //cerca il primo algoritmo che riesce a risolvere
        _.find(_algorithms, function(alg){
          return alg.apply(schema);
        });
      }


      return {
        solveAll: solve,
        solveStep: solveStep
      }
    }]);
