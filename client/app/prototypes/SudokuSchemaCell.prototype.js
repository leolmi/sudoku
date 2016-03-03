'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchemaCell',['$rootScope',
    function($rootScope) {

      function resetAvailables(cell) {
        cell.available = _.range(1, cell.dimension+1);
      }

      var SudokuSchemaCell = function(n) {
        this.dimension = n || 9;
        this.value = null;
        this.fixed = false;
        this.available = [];
        this.pencil = [];
        resetAvailables(this);
      };
      SudokuSchemaCell.prototype = {
        dimension: 9,
        value: null,
        fixed: false,
        available:[],
        pencil:[],
        setValue:function(v) {
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
        }
      };
      return (SudokuSchemaCell);
    }]);
