'use strict';

angular.module('sudokuApp')
  .factory('editorService', [
    function() {
      const _state = {};

      function setValue() {}
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
