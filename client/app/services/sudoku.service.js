'use strict';

angular.module('sudokuApp')
  .factory('sudokuService', ['SudokuSchema','popupService','solver','$rootScope','util',
    function(SudokuSchema, popupService, solver, $rootScope, util) {
      const _state = {
        drawing: false,
        menu: false,
        schema: new SudokuSchema('005030170073016000400900000300000060004000900020000003000009002000650390037020500')
      };

      function _refreshPos() {
        if (!_state.schema) return;
        _state.schema._values = _state.schema.toString();
        const tot = _state.schema.dimension*_state.schema.dimension;
        const fixed = _state.schema.fixedCount();
        const values = _state.schema.valuesCount();
        _state.pos = ((values / (tot - fixed)) * 100).toFixed(0);
        _state.posDesc = values + ' su ' + (tot-fixed) + '  ('+_state.pos+'%)';
      }

      function _safe(scope, cb) {
        if (scope) {
          util.safeApply(scope, () => cb());
        } else {
          cb();
        }
      }

      function setValue(value) {
        console.log('cell(%s,%s)=%s', _state.x+1, _state.y+1, value);
        if (_state.schema.validateCoord(_state.x, _state.y))
          _state.schema.cell(_state.x, _state.y).setValue(value, false, _state.schema.pencil);
      }

      function move(code) {
        switch(code) {
          case 0: // LEFT
            _state.x = (_state.x > 0) ? _state.x - 1 : _state.schema.dimension - 1;
            break;
          case 1: // UP
            _state.y = (_state.y > 0) ? _state.y - 1 : _state.schema.dimension - 1;
            break;
          case 2: // RIGHT
            _state.x = (_state.x < _state.schema.dimension - 1) ? _state.x + 1 : 0;
            break;
          case 3: // DOWN
            _state.y = (_state.y < _state.schema.dimension - 1) ? _state.y + 1 : 0;
            break;
          case 4: // RIGHT AND DOWN
            if (_state.x === _state.schema.dimension - 1) _state.y = (_state.y < _state.schema.dimension - 1) ? _state.y + 1 : 0;
            _state.x = (_state.x < _state.schema.dimension - 1) ? _state.x + 1 : 0;
            break;
        }
      }
      function toggle(scope) {
        return util.safeApply(scope,() => {
          if (!_state.drawing) {
            _state.schema.reset(true);
            _state.x = 0;
            _state.y = 0;
            _state.drawing = true;
          } else {
            _state.schema.fix();
            solver.solveAll(_state.schema, {hidden:true})
              .finally(function() {
                _state.drawing = false;
              });
          }
        });
      }
      function select(x,y) {
        const clr = _.isUndefined(x);
        _state.x = clr ? null : x;
        _state.y = clr ? null : y;
        _state.index = clr ? null : x + y*((_state.schema||{}).dimension||9);
      }


      function _open(schema) {
        _state.schema = new SudokuSchema(schema);
        solver.solveAll(_state.schema, {hidden:true});
        _state.pos = 0;
      }


      function open(schema) {
        if (_state.schema.isDoing()) {
          popupService.show({
            title: 'Open new schema?',
            text: 'Current schema will be discard',
            ok: 'OK',
            cancel: 'Cancel'
          }).then(function() {
            _open(schema);
          });
        } else {
          _open(schema);
        }
      }

      function cell() {
        return _state.schema.cell(_state.x, _state.y);
      }

      function _import(data) {
        _state.schema.keep(data);
      }

      function solve(scope) {
        _safe(scope, () => solver.solveAll(_state.schema));
      }

      function reset(scope) {
        _safe(scope, () => _state.schema.reset());
      }

      $rootScope.$on('cell-value-changed', _refreshPos);

      return {
        state: _state,
        setValue: setValue,
        select: select,
        import: _import,
        move: move,
        toggle: toggle,
        open: open,
        cell: cell,
        solve: solve,
        reset: reset
      }
    }]);
