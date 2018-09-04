'use strict';

angular.module('sudokuApp')
  .factory('sudokuService', ['SudokuSchema','popupService','solver','$rootScope','util',
    function(SudokuSchema, popupService, solver, $rootScope, util) {
      const _state = {
        drawing: false,
        menu: false,
        schema: new SudokuSchema()
      };
      const _constants = {
        symmetry: {
          none: 'none',
          vertical: 'vertical',          // verticale
          horizontal: 'horizontal',      // orizzontale
          polar: 'polar',                // polare
          total: 'total',                // (horizontal + vertical + polar)
          diagonalNWSE: 'diagonalNWSE',  // diagonale \
          diagonalNESW: 'diagonalNESW'   // diagonale /
        },
        bookmark: 'X'
      };

      function _refreshPos() {
        if (!_state.schema || _state.drawing) return;
        // _state.schema._values = _state.schema.toString();
        const tot = _state.schema.dimension*_state.schema.dimension;
        const fixed = _state.schema.fixedCount();
        const values = _state.schema.valuesCount();
        _state.pos = ((values / (tot - fixed)) * 100).toFixed(0);
        _state.posDesc = values + ' su ' + (tot-fixed) + '  ('+_state.pos+'%)';
      }

      function _resetPos(state) {
        state = state||_state;
        state.pos = null;
        state.posDesc = null;
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

      function move(code, state) {
        state = state||_state;
        switch(code) {
          case 0: // LEFT
            state.x = (state.x > 0) ? state.x - 1 : state.schema.dimension - 1;
            break;
          case 1: // UP
            state.y = (state.y > 0) ? state.y - 1 : state.schema.dimension - 1;
            break;
          case 2: // RIGHT
            state.x = (state.x < state.schema.dimension - 1) ? state.x + 1 : 0;
            break;
          case 3: // DOWN
            state.y = (state.y < state.schema.dimension - 1) ? state.y + 1 : 0;
            break;
          case 4: // RIGHT AND DOWN
            if (state.x === state.schema.dimension - 1) state.y = (state.y < state.schema.dimension - 1) ? state.y + 1 : 0;
            state.x = (state.x < state.schema.dimension - 1) ? state.x + 1 : 0;
            break;
        }
      }

      function _checkDoing(o, cb) {
        if (_state.schema.isDoing()) {
          popupService.show({
            title: o.title,
            text: o.text || 'Current schema will be discard',
            ok: 'OK',
            cancel: 'Cancel'
          }).then(function() {
            cb();
          });
        } else {
          cb();
        }
      }


      function toggle(scope) {
        _safe(scope,() => {
          if (!_state.drawing) {
            _checkDoing({
              title: 'Switch in drawing mode?'
            }, () => {
              _state.schema.reset(true);
              select(0,0);
              _resetPos();
              _state.drawing = true;
            });
          } else {
            _state.schema.fix();
            solver.solveAll(_state.schema, {hidden:true})
              .finally(function() {
                _state.drawing = false;
              });
          }
        });
      }
      function select(x, y, state) {
        state = state||_state;
        const clr = _.isUndefined(x);
        state.x = clr ? null : x;
        state.y = clr ? null : y;
        state.index = clr ? null : x + y*((state.schema||{}).dimension||9);
        return state.schema.cell(state.x, state.y);
      }


      function _open(schema) {
        _state.schema = new SudokuSchema(schema);
        if (!(_state.schema.report||[]).length)
          solver.solveAll(_state.schema, {hidden:true});
        _resetPos();
        select();
      }

      function open(schema) {
        _checkDoing({
          title: 'Open new schema?'
        }, () => {
          _open(schema);
        });
      }

      function cell(state) {
        state = state||_state;
        return state.schema.cell(state.x, state.y);
      }

      function _import(data) {
        _state.schema.keep(data);
      }

      function solve(scope) {
        _safe(scope, () => solver.solveAll(_state.schema));
      }

      function reset(scope, state) {
        state = state||_state;
        _safe(scope, () => state.schema.reset());
      }

      function getSymmetrycCells(source, symmetry, state) {
        state = state||_state;
        const d = state.schema.dimension - 1;
        const dv = d/2 + 1;
        switch(symmetry) {
          case 'vertical':
            return (source.y === dv) ? [] : [state.schema.cell(source.x, d - source.y)];
          case 'horizontal':
            return (source.x === dv) ? [] : [state.schema.cell(d - source.x, source.y)];
          case 'polar':
            return (source.x === dv && source.y === dv) ? [] : [state.schema.cell(d - source.x, d - source.y)];
          case 'total':
            return (source.x === dv && source.y === dv) ? [] : [
              state.schema.cell(source.x, d - source.y),
              state.schema.cell(d - source.x, source.y),
              state.schema.cell(d - source.x, d - source.y)
            ];
          case 'diagonalNWSE':  //  asse di simmetria /
            return (source.x + source.y === d) ? [] : [state.schema.cell(d - source.y, d - source.x)];
          case 'diagonalNESW': //  asse di simmetria \
            return (source.x === source.y) ? [] : [state.schema.cell(source.y, source.x)];
          default: return [];
        }
      }

      function getRamndomValue(array) {
        if (!_.isArray(array)) return 0;
        const n = array.length;
        const rIndex = Math.floor((Math.random() * n) + 1);
        return array[rIndex];
      }

      $rootScope.$on('cell-value-changed', _refreshPos);

      return {
        constants: _constants,
        state: _state,
        getSymmetrycCells: getSymmetrycCells,
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
