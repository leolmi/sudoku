'use strict';

angular.module('sudokuApp')
  .factory('engineService', ['$rootScope','$q','EngineOptions','SudokuSchema','sudokuService',
    function($rootScope, $q, EngineOptions,SudokuSchema,sudokuService) {
      const _state = {
        options: new EngineOptions(),
        minCount: 20,
        maxCount: 40,
        running: {
          geometry: true,
          cycles: 0,
          active: false
        },
        stop: false,
        schemas: []
      };
      const _constants = {
        stops: {
          manual: 'manual',
          found: 'found',
          after: 'after'
          // time: 'time'
        }
      };
      const _schema = {
        state: {
          drawing: true,
          schema: new SudokuSchema(),
          generator: true,
          lockAutoMove: true,
          symmetry: 'none'
        },
        setValue(value) {
          if (_schema.state.schema.validateCoord(_schema.state.x, _schema.state.y)) {
            const cell = _schema.state.schema.cell(_schema.state.x, _schema.state.y);
            if (cell.locked) return;
            cell.setValue(value, true);
            _schema.setSymmetricValues(cell);
          }
        },
        move(code) {
          sudokuService.move(code, _schema.state);
        },
        toggle() {},
        cell() {
          return sudokuService.cell(_schema.state);
        },
        reset(scope) {
          sudokuService.reset(scope, _schema.state);
        },
        solve() {},
        select(x, y, p, mode) {
          const cell = sudokuService.select(x, y, _schema.state);
          if (mode === 'click' && !cell.locked) {
            cell.value ? cell.setValue() : cell.setValue(sudokuService.constants.bookmark, true);
            _schema.setSymmetricValues(cell);
          }
          return cell;
        },
        setSimmetry(symmetry) {
          _schema.state.symmetry = symmetry;
          let v = null;
          switch(symmetry) {
            case 'horizontal':   v = '000001111000001111000001111000001111000001111000001111000001111000001111000001111'; break;
            case 'polar':        v = '000000000000000000000000000000000000000001111111111111111111111111111111111111111'; break;
            case 'vertical':     v = '000000000000000000000000000000000000000000000111111111111111111111111111111111111'; break;
            case 'total':        v = '000001111000001111000001111000001111000001111111111111111111111111111111111111111'; break;
            case 'diagonalNWSE': v = '000000000000000001000000011000000111000001111000011111000111111001111111011111111'; break;
            case 'diagonalNESW': v = '000000000100000000110000000111000000111100000111110000111111000111111100111111110'; break;
          }
          _schema.state.schema.lock(v);
        },
        setSymmetricValues(origin) {
          const others = sudokuService.getSymmetrycCells(origin, _schema.state.symmetry, _schema.state);
          others.forEach((c) => {
            if (origin.value) {
              c.setValue(sudokuService.constants.bookmark, true);
            } else {
              c.setValue();
            }
          });
        }
      };

      function _isOnEnd() {
        return (
          // uscita manuale confermata
          (_state.options.stop.type === _constants.stops.manual && _state.stop) ||
          // uscita su superamento numero cicli
          (_state.running.cycles >= _state.options.enhancementCycles) ||
          // uscita su numero di schemi generati
          (_state.options.stop.type === _constants.stops.after && _state.running.schemas >= _state.options.stop.number));
      }

      function validate() {
        if (_state.running.active) return 'Generator is working!';
        _state.fixed = _.filter(_schema.state.schema.cells, (c) => !!c.value).length;
        if (_state.fixed > _state.options.fixedValues) return 'Wrong number of values!';
        // if (_state.fixed < _state.minCount) return 'Values under minimun (' + _state.minCount + ')!';
        if (_state.fixed > _state.maxCount) return 'Values up to maximum (' + _state.maxCount + ')!';


      }

      function _valorize() {

      }

      function _solve() {
        return $q((resolve, reject) => {
          // valuta la geometria:
          //    - aggiunge segnaposti mancanti al numero richiesto secondo la geometria richiesta
          if (_state.running.geometry) {
            // costruisce lo schema di riferimento per la geometria

          }
          // imposta i valori per tutte le celle solo segnaposto (x)
          _valorize();



        });
      }

      function _cycle() {
        _state.running.cycles ++;
        _solve()
          .then(() => {
            if (_isOnEnd()) {
              _state.running.active = false;
            } else {
              _cycle();
            }
          }, (err) => {
            _state.error = err;
            _state.running.active = false;
          });
      }

      function start() {
        _state.error = validate();
        if (_state.error) return;
        _state.running.active = true;
        _state.running.geometry = true;
        _state.running.cycles = 0;
        _cycle();
      }

      function stop() {

      }

      $rootScope.$on('cell-value-changed', () => _state.error = validate());

      validate();

      return {
        constants: _constants,
        schema: _schema,
        state: _state,
        validate: validate,
        start: start,
        stop: stop
      }
    }]);
