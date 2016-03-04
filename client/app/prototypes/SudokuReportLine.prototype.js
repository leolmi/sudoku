'use strict';

angular.module('sudokuApp')
  .factory('SudokuReportLine',[
    function() {
      var SudokuReportLine = function(alg, schema, cell) {
        this.algCode = _.has(alg, 'code') ? alg.code : '';
        this.algName = _.has(alg, 'name') ? alg.name : '';
        this.score = _.has(alg, 'score') ? alg.score : '';
        if (schema && cell) {
          this.value = cell.value;
          this.index = schema.cells.indexOf(cell);
        }
      };
      SudokuReportLine.prototype = {
        algCode: '',
        algName: '',
        score: 0,
        value: null,
        index: -1
      };
      return (SudokuReportLine);
    }]);
