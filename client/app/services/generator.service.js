'use strict';

angular.module('sudokuApp')
  .factory('generator',['GeneratorOptions',
    function(GeneratorOptions) {
      var _options = new GeneratorOptions();
      var _state = {
        running: false
      };

      function run() {
        _state.running = true;

      }

      function stop() {
        _state.running = false;

      }

      return {
        options: _options,
        state: _state,
        run: run,
        stop: stop
      }
    }]);
