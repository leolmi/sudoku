'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchema',[
    function() {

      function initValues(schema) {
        return new Array(schema.dimension*schema.dimension);
      }

      var SudokuSchema = function(options) {
        this.symmetry = 'none';
        this.dimension = 9;
        this.values = initValues(this);
        this.fixed = initValues(this);
        this.score = 0;
        if (options)
          _.extend(this, options);
      };
      SudokuSchema.prototype = {
        symmetry: 'none',
        dimension: 9,
        values: [],
        fixed: [],
        score: 0,
        getValue: function(x,y) {
          return this.values[(y*9)+x];
        }
      };

      return (SudokuSchema);
    }]);
