'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchemaCell',['$rootScope',
    function($rootScope) {

      function resetAvailables(cell) {
        if (cell.value)
          cell.available = [];
        else {
          for (var i = 1; i < cell.dimension + 1; i++)
            cell.available.push(i);
        }
      }

      var SudokuSchemaCell = function(n) {
        this.dimension = n || 9;
        this.value = null;
        this.fixed = false;
        this.available = [];
        this.pencil = [];
        resetAvailables(this);
        var self = this;
        $rootScope.$watch(function () {
          return self.value;
        }, function () {
          resetAvailables(self);
          $rootScope.$broadcast('cell-value-changed', self);
        });
      };
      SudokuSchemaCell.prototype = {
        dimension: 9,
        value: null,
        fixed: false,
        available:[],
        pencil:[],
        removeAvailables:function(values) {
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
