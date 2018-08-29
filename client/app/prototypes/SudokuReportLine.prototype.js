'use strict';

angular.module('sudokuApp')
  .factory('SudokuReportLine',[
    function() {
      var SudokuReportLine = function(alg, schema, cell, avl) {
        this.alg = alg ? alg.code || alg.alg || '' : '';
        this.score = alg ? alg.score || 0 : 0;
        this.values = avl || [];
        this.x = (cell||alg).x;
        this.y = (cell||alg).y;
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
        x: -1,
        y: -1,
        index: -1,
        load: function(rl) {
          if (rl) _.extend(this, rl);
        }
      };

      SudokuReportLine.prototype.toString = function() {
        return this.alg + ' ('+this.score+'): ' + (this.value?this.value:'') + '  ('+(this.x+1)+','+(this.y+1)+')';
      };

      return (SudokuReportLine);
    }]);
