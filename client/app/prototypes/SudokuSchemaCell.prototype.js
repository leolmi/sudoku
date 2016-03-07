'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchemaCell',['$rootScope',
    function($rootScope) {

      function resetAvailables(cell) {
        cell.available = _.range(1, cell.dimension+1);
      }

      var SudokuSchemaCell = function(n, i) {
        this.dimension = n || 9;
        this.value = null;
        this.index = i;
        this.x = n % 9;
        this.y = parseInt(n / 9);
        this.fixed = false;
        this.available = [];
        this.pencil = [];
        resetAvailables(this);
      };
      SudokuSchemaCell.prototype = {
        dimension: 9,
        value: null,
        index: -1,
        x: -1,
        y: -1,
        fixed: false,
        available:[],
        pencil:[],
        setValue:function(v, force) {
          if (this.fixed && !force) return;
          this.value = _.isNumber(v) && v > 0 && v <= this.dimension ? v : undefined;
          resetAvailables(this);
          $rootScope.$broadcast('cell-value-changed', this);
        },
        removeAvailables:function(values) {
          if (this.value) {
            this.available = [];
            return;
          }
          if (!values) return;
          if (!_.isArray(values)) values = [values];
          this.available = _.difference(this.available, values);
        },
        isEmpty: function() {
          return !this.value;
        },
        isTwin: function(cell) {
          return !_.difference(this.available, cell.available).length;
        },
        toString: function() {
          return '{'+this.index+'} - '+this.available.join();
        }
      };
      return (SudokuSchemaCell);
    }]);
