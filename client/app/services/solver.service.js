'use strict';

angular.module('sudokuApp')
  .factory('solver',['SudokuSchema','$injector','SolverOptions','algorithms','util','$rootScope','$timeout','$q',
    function(SudokuSchema,$injector,SolverOptions,algorithms,util,$rootScope,$timeout,$q) {
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

      function _calcDiff(schema) {
        return _.find(algorithms.scores, (s) => s.max > (schema.score||0));
      }

      /**
       * Risolve lo schema restituendo tutte le possibili soluzioni
       * @param schema
       * @param [options]
       * @returns {*}
       */
      function solveAll(schema, options) {
        return $q(function (resolve, reject) {
          if (!schema) return reject('Undefined schema!');
          if (_state.solving) return reject('Solver busy!');
          schema.refreshAvailables();
          schema.unique = false;
          delete schema.meta.diff;
          _state.solving = true;
          options = new SolverOptions(options);
          _state.error = null;
          schema.report.splice(0);
          schema.disableLog = false;
          let wschema;
          if (options.hidden) {
            wschema = new SudokuSchema();
            wschema.cloneBy(schema);
          } else {
            wschema = schema;
          }
          const schemas = [wschema];
          let result = undefined;
          try {
            result = _solveSchemas(schemas, options);
            _state.solving = false;
            schema._result = {solutions: result || []};
            if (result.length === 1) {
              if (!options.hidden) schema.keep(result[0]._values);
              schema.report = _.clone(result[0].report);
              schema.meta.score = schema.getScore();
              schema.meta.numCount = result[0].fixedCount();
              schema.unique = true;
              schema.meta.diff = _calcDiff(schema);
              schema.checkName();
            }
            resolve(result);
          } catch (err) {
            _state.error = err;
            _state.solving = false;
            schema._result = {error: err};
            reject(err);
          }
        });
      }

      /**
       * Risolve tutti gli schemi autogenerati
       * @param schemas
       * @param [options]
       * @returns {Array}
       */
      function _solveSchemas(schemas, options) {
        do {
          const forks = [];
          schemas.forEach(function (s) {
            //cerca il primo algoritmo che riesce a risolvere
            if (!s.isComplete()) {
              _.find(_algorithms, function (alg) {
                return (forks.length > options.maxSchemas || (alg.active && alg.apply(s, forks)));
              });
            }
            s._values = s.toString();
          });
          if (forks.length > 0)
            Array.prototype.push.apply(schemas, forks);
          util.remove(schemas, function (s) {
            return s.isCorrupted();
          });
        } while (schemas.length < options.maxSchemas && !areComplete(schemas));

        //restituisce l'elenco degli schemi completati
        return _(schemas)
          .each(function (s) {s.getScore();})
          .filter(function (s) {return s.isComplete();});
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
        solveAll(schema, {hidden:true})
          .then(function(res){
            schema.report = (res||[])[0]||{}.report||[];
          }, function(err){
            schema.report = [];
            schema.log();
          });
      });


      return {
        state: _state,
        algorithms: _algorithms,
        solveAll: solveAll,
        solveStep: solveStep
      }
    }]);
