'use strict';

angular.module('sudokuApp')
  .factory('solver',['SudokuSchema','$injector','SolverOptions','algorithms','util','$rootScope','$timeout',
    function(SudokuSchema,$injector,SolverOptions,algorithms,util,$rootScope,$timeout) {
      const _state = {
        solving: false
      };
      const _algorithms = _.map(algorithms.availableAlgorithms, function(a){
        const ctor = $injector.get(a.proto);
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
       * @param [options]
       * @returns {*}
       */
      function solveAll(schema, options) {
        if (!schema || _state.solving) return false;
        _state.solving = true;
        options = new SolverOptions(options);
        _state.error = null;
        schema.report = [];
        schema.disableLog = false;
        const schemas = [schema];
        let result = undefined;
        try {
          result = solveSchemas(schemas, options);
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
       * @param [options]
       * @returns {Array}
       */
      function solveSchemas(schemas, options) {
        do {
          const forks = [];
          schemas.forEach(function (s) {
            //cerca il primo algoritmo che riesce a risolvere
            _.find(_algorithms, function (alg) {
              return (forks.length > options.maxSchemas || (alg.active && alg.apply(s, forks)));
            });
          });
          if (forks.length > 0)
            Array.prototype.push.apply(schemas, forks);
          util.remove(schemas, function (s) {
            return s.isCorrupted();
          });
        } while (schemas.length < options.maxSchemas && !areComplete(schemas));

        //restituisce l'elenco degli schemi completati
        const solutions = _(schemas)
          .each(function (s) {s.getScore();})
          .filter(function (s) {return s.isComplete();})
          .groupBy(function (s) {return s.toString();})
          .value();

        const result = [];
        _.keys(solutions).forEach(function (s) {
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
          return (alg.active && alg.apply(schema));
        });
      }


      $rootScope.$on('need-tobe-solved', function(e, schema) {
        $timeout(function() {
          const clone = new SudokuSchema();
          clone.cloneBy(schema);
          const res = solveAll(clone);
          if (res && res.length === 1) {
            schema.report = res[0].report;
          } else {
            schema.report = [];
            schema.log();
          }
        },0);
      });


      return {
        state: _state,
        algorithms: _algorithms,
        solveAll: solveAll,
        solveStep: solveStep
      }
    }]);
