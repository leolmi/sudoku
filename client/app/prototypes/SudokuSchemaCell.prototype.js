'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchemaCell',['$rootScope',
    function($rootScope) {

      function resetAvailables(cell) {
        cell.available = cell.fixed ? [] : _.range(1, cell.dimension + 1);
      }

      var SudokuSchemaCell = function(n, i) {
        this.dimension = n || 9;
        this.value = 0;
        this.index = i;
        this.x = i % 9;
        this.y = parseInt(i / 9);
        this.fixed = false;
        this.error = false;
        this.available = [];
        this.pencil = [];
        resetAvailables(this);
      };
      SudokuSchemaCell.prototype = {
        dimension: 9,
        value: 0,
        index: -1,
        x: -1,
        y: -1,
        fixed: false,
        error: false,
        available:[],
        pencil:[],
        setValue:function(v, force) {
          if (this.fixed && !force) return;
          const newv = (_.isNumber(v) && v > 0 && v <= this.dimension) ? v : 0;
          if (newv === this.value) return;
          this.value = newv;
          resetAvailables(this);
          $rootScope.$broadcast('cell-value-changed', this);
        },
        resetAvailables: function() {
          resetAvailables(this);
        },
        removeAvailables:function(values) {
          if (this.value) {
            this.available = [];
          } else {
            if (!values) return;
            if (!_.isArray(values)) values = [values];
            this.available = _.difference(this.available, values);
          }
        },
        isEmpty: function() {
          return !this.value;
        },
        isTwin: function(cell) {
          return !_.difference(this.available, cell.available).length;
        },
        text: function() {
          return ''+(this.value||'');
        },
        toString: function() {
          return '{'+this.index+'} - '+this.available.join();
        }
      };
      return (SudokuSchemaCell);
    }]);
