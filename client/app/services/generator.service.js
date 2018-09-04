'use strict';

angular.module('sudokuApp')
  .factory('generator',['$rootScope','GeneratorOptions','SudokuSchema','solver','$timeout',
    function($rootScope,EngineOptions, SudokuSchema, solver, $timeout) {
      const _options = new EngineOptions();
      const _state = {
        minCount: 20,
        maxCount: 40,
        running: false,
        stop: false,
        schemas: []
      };
      const _constants = {
        stops: {
          manual: 'manual',
          found: 'found',
          after: 'after',
          time: 'time'
        }
      };
      let _running = {};


      /**
       * Veri
       * @returns {boolean}
         */
      function isOnEnd() {
        return (
          // uscita manuale confermata
          (_options.stop.type == 'manual' && _state.stop) ||
          // uscita su superamento numero cicli
          (_running.cicle >= _options.enhancementCycles) ||
          // uscita su numero di schemi generati
          (_options.stop.type == 'schemas' && _running.schemas >= _options.stop.number));
      }

      /**
       * Salva lo schema sul repository
       * @param schema
         */
      function save(schema) {
        //TODO: ....
      }

      function handleRightSchema(schema, save) {
        //valuta difficoltà

        _running.schemas.push(schema);
        _running.cicle = 0;
        if (_options.oneSchemaOnGeometry)
          _running.geometry = true;
        if (save)
          save(schema);
      }

      /**
       * Gestisce il risultato
       * @param result
         */
      function handleResult(result) {
        if (result && result.length>0) {
          if (result.length>1){
            if (_options.uniqueSolution) {
              log('Schema scartato (%0 soluzioni)', _result.length);
            } else {
              handleRightSchema(result[0]);
            }
          } else {
            handleRightSchema(result[0], true);
          }
        }
      }



      function validate() {
        if (_state.running) return 'Generator is working!';
        const fixed = _.filter(_state.schema.cells, (c) => !!c.value).length;
        if (fixed !== _options.fixedValues) return 'Wrong number of values!';
        if (fixed < _state.minCount) return 'Values under minimun (' + _state.minCount + ')!';
        if (fixed > _state.maxCount) return 'Values up to maximum (' + _state.maxCount + ')!';


      }

      function stop() {
        _state.stop = true;
      }


      function run() {
        _state.error = validate();
        if (_state.error) return;

        _state.running = true;
        _state.log = [];
        _running = {
          schema: null,
          cicle: 0,
          schemas: 0,
          geometry: false
        };
        let end = false;

        do {
          _running.schema = new SudokuSchema();
          _running.cicle++;

          //validazione schema
          if (_running.geometry) {
            // genera una nuova geometria
            //TODO: .....
          }
          //valorizza lo schema
          //TODO: .....

          //risolve lo schema
          //TODO: .....

          const result = solver.solveAll(_running.schema);
          handleResult(result);

          end = isOnEnd();
        } while(!end);



        // inizia ciclo:
        // variabili: {cicli}, {schemi_generati}
        //
        //
        // 1. validazione schema
        //    1.1 inserisce i numeri mancanti fino al numero impostato
        //        secondo le regole del sudoku [fixedValues]
        // 2. tenta di risolverlo
        // 3. se risolve
        //    3.1 salva lo schema nel repository
        //    3.2 se schema conforme alle richieste incrementa {schemi_generati}
        //    3.2 notifica la soluzione
        // valutaFine()


        //valutaFine():
        //  se [stop].[type] = 'manual' && generati > 0 ESCE, altrimenti -> 1.
        //  se [stop].[type] = 'auto' && generati >= [stop].[number] -> ESCE, altrimenti -> 1

        //  [enhancementCycles]

      }




      return {
        constants: _constants,
        options: _options,
        state: _state,
        validate: validate,
        run: run,
        stop: stop
      }
    }]);
