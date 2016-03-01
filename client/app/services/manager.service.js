'use strict';

angular.module('sudokuApp')
  .factory('manager',['SudokuSchema','$injector','algorithms',
    function(SudokuSchema,$injector,algorithms) {
      var _options = {
        symmetries:['none','total','polar','horizontal','vertical','diagonal \\','diagonal /'],
        scores:[
          {name:'very easy', max:80},
          {name:'easy', max:100},
          {name:'middle', max:160},
          {name:'hard', max:240},
          {name:'very hard', max:100000}]
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
          return !s.isComplete();
        });
      }

      function solve(schema, step) {
        if (!schema) return false;
        var schemas = [schema];
        solveSchemas(schemas, step);
      }
      function solveSchemas(schemas, step) {
        var done = false;
        do {
          var forks = [];
          schemas.forEach(function(s){
            //cerca il primo algoritmo che riesce a risolvere
            var a = _.find(_algorithms, function(alg){
              return alg.apply(s, forks);
            });
            if (a)
              s.log('Applicato algoritmo '+ a.name);
          });
          if (forks.length>0)
            Array.push.apply(schemas, forks);
          done = step || areComplete(schemas);

        } while(!done);
      }


      function solveSingleSchema(schema) {
        var done = false;
        do {
          var forks = [];
          //cerca il primo algoritmo che riesce a risolvere
          var a = _.find(_algorithms, function(alg){
            return alg.apply(schema, forks);
          });
          if (a){
            schema.log('Applicato algoritmo '+ a.name);
            //verifica la completezza dello schema oppure
            //la richiesta di stop sullo step
            done = step || schema.isComplete();
          } else {
            //nessun algoritmo produce risultato
            //non risolvibile...
            done = true;
          }
        } while(!done);
      }


      function solveSchema(schema, step) {
        var done = false;
        do {
          //cerca il primo algoritmo che riesce a risolvere
          var a = _.find(_algorithms, function(alg){
            return alg.apply(schema);
          });
          if (a){
            schema.log('Applicato algoritmo '+ a.name);
            //verifica la completezza dello schema oppure
            //la richiesta di stop sullo step
            done = step || schema.isComplete();
          } else {
            //nessun algoritmo produce risultato
            //non risolvibile...
            done = true;
          }

        } while(!done);
      }


      return {
        options:_options,
        solve: solveSchema
      }
    }]);
