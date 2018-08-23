'use strict';

angular.module('sudokuApp')
  .factory('schemaService', [
    function() {
      const _state = {};
      function getInfo() {
        return {
          w: 9,
          h: 9,
          wg: 3,
          hg: 3
        }
      }
      function setValue(value) {
        console.log('cell(%s,%s)=%s', _state.x+1, _state.y+1, value);
      }
      function move() {}
      function toggle() {}
      function select(x,y) {
        _state.x = x;
        _state.y = y;
        console.log('cell=%s,%s', x+1, y+1);
      }

      return {
        state: _state,
        getInfo: getInfo,
        setValue: setValue,
        select: select,
        move: move,
        toggle: toggle
      }
    }]);
