'use strict';

angular.module('sudokuApp')
  .factory('generator',['GeneratorOptions','SudokuSchema','solver','$timeout',
    function(GeneratorOptions, SudokuSchema, solver, $timeout) {
      var _options = new GeneratorOptions();
      var _state = {
        running: false,
        stop: false,
        schemas: []
      };
      var _running = {};

      /**
       * Restituisce uno dei valori in elenco in modo randomico
       * @param array
       * @returns {*}
         */
      function getRamndomValue(array) {
        if (_.isArray(array)) return 0;
        var n = array.length;
        var rIndex = Math.floor((Math.random() * n) + 1);
        return array[rIndex];
      }

      /**
       * Restituisce la collezione di celle secondo
       * la simmetria scelta e a partire dalla cella passata
       * @param schema
       * @param cell
       * @param symmetry
         * @returns {*[]}
         */
      function getSymmetrycCells(schema, cell, symmetry) {
        var cells = [cell], x, y;
        switch (symmetry) {
          case 'total': //(horizontal + vertical)
            x = cell.dimension - cell.x;
            if (x != cell.x)
              cells.push(schema.cells[cell.y * cell.dimension + x]);
            y = cell.dimension - cell.y;
            if (y != cell.y)
              cells.push(schema.cells[y * cell.dimension + cell.x]);
            if (x != cell.x && y != cell.y)
              cells.push(schema.cells[y * cell.dimension + x]);
            break;
          case 'polar':
            cells.push(schema.cells[cell.x * cell.dimension + cell.y]);
            break;
          case 'horizontal':  //asse di simmetria verticale
            x = cell.dimension - cell.x;
            if (x != cell.x)
              cells.push(schema.cells[cell.y * cell.dimension + x]);
            break;
          case 'vertical':  //asse di simmetria orizzontale
            y = cell.dimension - cell.y;
            if (y != cell.y)
              cells.push(schema.cells[y * cell.dimension + cell.x]);
            break;
          case 'diagonalNWSE': //  asse di simmetria /
            if (cell.x != cell.y)
              cells.push(schema.cells[cell.y * cell.dimension + cell.x]);
            break;
          case 'diagonalNESW': //  asse di simmetria \
            x = cell.dimension - cell.x;
            y = cell.dimension - cell.y;
            if (x != y)
              cells.push(schema.cells[y * cell.dimension + x]);
            break;
        }
        return cells;
      }

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

      function run() {
        if (_state.running) return;
        _state.running = true;
        _state.log = [];
        _running = {
          schema: null,
          cicle: 0,
          schemas: 0,
          geometry: false
        };
        var end = false;

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

          var result = solver.solveAll(_running.schema);
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

      function stop() {
        _state.stop = true;
      }

      return {
        options: _options,
        state: _state,
        run: run,
        stop: stop
      }
    }]);
