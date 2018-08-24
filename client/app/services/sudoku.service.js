'use strict';

angular.module('sudokuApp')
  .factory('sudokuService', ['SudokuSchema',
    function(SudokuSchema) {
      const _state = {
        drawing: false,
        menu: false,
        schema: new SudokuSchema('005030170073016000400900000300000060004000900020000003000009002000650390037020500')
      };
      function setValue(value) {
        console.log('cell(%s,%s)=%s', _state.x+1, _state.y+1, value);
        if (_state.schema.validateCoord(_state.x, _state.y))
          _state.schema.cell(_state.x, _state.y).setValue(value);
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
      function toggle() {}
      function select(x,y) {
        _state.x = x;
        _state.y = y;
        console.log('current cell: %s,%s', x+1, y+1);
      }

      return {
        state: _state,
        setValue: setValue,
        select: select,
        move: move,
        toggle: toggle
      }
    }]);
