'use strict';

angular.module('sudokuApp')
  .factory('SudokuReportLine',[
    function() {
      var SudokuReportLine = function(alg, schema, cell, avl) {
        this.alg = alg ? alg.code || '' : '';
        this.score = alg ? alg.score || 0 : 0;
        this.values = avl || [];
        if (schema && cell) {
          this.value = cell.value;
          this.index = schema.cells.indexOf(cell);
        }
      };
      SudokuReportLine.prototype = {
        alg: '',
        score: 0,
        value: null,
        values: null,
        index: -1,
        load: function(rl) {
          if (rl)
            _.extend(this, rl);
        }
      };
      return (SudokuReportLine);
    }]);
