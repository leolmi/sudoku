'use strict';

angular.module('sudokuApp')
  .factory('manager',['SudokuSchema','$injector','algorithms','util',
    function(SudokuSchema,$injector,algorithms,util) {
      var _state = {
        solving: false
      };
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
       * @param [best]
       * @returns {*}
       */
      function solveAll(schema, best) {
        if (!schema || _state.solving) return false;
        _state.solving = true;
        _state.error = null;
        schema.disableLog = false;
        var schemas = [schema];
        var result = undefined;
        try {
          result = solveSchemas(schemas, best);
          _state.solving = false;
        }
        catch(err) {
          _state.error = err;
          _state.solving = false;
        }
        return result;
      }

      /**
       * Risolve tutti gli schemi autogenerati
       * @param schemas
       * @param [best]
       * @returns {Array}
       */
      function solveSchemas(schemas, best) {
        do {
          var forks = [];
          schemas.forEach(function(s){
            //cerca il primo algoritmo che riesce a risolvere
            _.find(_algorithms, function(alg){
              return alg.apply(s, forks, best);
            });
          });
          if (forks.length>0)
            Array.prototype.push.apply(schemas, forks);
          util.remove(schemas, function(s){
            return s.isCorrupted();
          });
        } while(!areComplete(schemas));
        //restituisce l'elenco degli schemi completati

        var solutions = _(schemas)
          .each(function(s){ s.getScore(); })
          .filter(function(s) { return s.isComplete(); })
          .groupBy(function(s) { return s.toString(); })
          .value();

        var result = [];
        _.keys(solutions).forEach(function(s){
          result.push(_(solutions[s])
            .sortBy('score')
            .first());
        });
        return result;
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
        state: _state,
        solveAll: solveAll,
        solveStep: solveStep
      }
    }]);
