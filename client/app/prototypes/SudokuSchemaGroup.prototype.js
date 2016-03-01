'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchemaGroup',['util','$rootScope',
    function(util, $rootScope) {
      var SudokuSchemaGroup = function() {
        this.id = util.guid();
        this.cells = [];
        var self = this;
        $rootScope.$on('cell-value-changed', function(e, cell){
          if (self.cells.indexOf(cell)>-1) {
            var values = self.getValues();
            self.cells.forEach(function(c){
              c.removeAvailables(values);
            });
          }
        });
      };
      SudokuSchemaGroup.prototype = {
        id: '',
        cells: [],
        getValues: function() {
          var values = [];
          this.cells.forEach(function(c){
            if (c.value>0)
              values.push(parseInt(c.value));
          });
          return values;
        }
      };
      return (SudokuSchemaGroup);
    }]);
