'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchemaCell',['$rootScope',
    function($rootScope) {

      function resetAvailables(cell) {
        cell.available = cell.fixed ? [] : _.range(1, cell.dimension + 1);
      }

      const SudokuSchemaCell = function(n, i) {
        this.dimension = n || 9;
        this.value = 0;
        this.index = i;
        this.x = i % 9;
        this.y = parseInt(i / 9);
        this.fixed = false;
        this.locked = false;
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
        locked: false,
        error: false,
        available:[],
        pencil:[],
        setValue(v, force, pencil) {
          const self = this;
          if (self.fixed && !force) return;
          const newv = !!force ? v : ((_.isNumber(v) && v > 0 && v <= self.dimension) ? v : 0);
          if (!newv) {
            self.pencil.splice(0);
            self.value = newv;
            resetAvailables(this);
          } else if (pencil) {
            const pos = self.pencil.indexOf(newv);
            if (pos>-1) {
              self.pencil.splice(pos, 1);
            } else {
              self.pencil.push(newv);
              self.value = 0;
            }
          } else {
            if (newv === self.value) return;
            self.value = newv;
            self.pencil.splice(0);
            resetAvailables(this);
          }
          $rootScope.$broadcast('cell-value-changed', this);
        },
        resetAvailables() {
          resetAvailables(this);
        },
        removeAvailables(values) {
          if (this.value) {
            this.available = [];
          } else {
            if (!values) return;
            if (!_.isArray(values)) values = [values];
            this.available = _.difference(this.available, values);
          }
        },
        isEmpty() {
          return !this.value;
        },
        isTwin(cell) {
          return !_.difference(this.available, cell.available).length;
        },
        text() {
          return ''+(this.value||'');
        },
        toString() {
          return '{'+this.index+'} - '+this.available.join();
        },
        has(v) {
          return this.pencil.indexOf(v) > -1;
        },
        pencilize() {
          if (this.fixed) return;
          this.pencil = _.clone(this.available);
          this.value = 0;
          $rootScope.$broadcast('cell-value-changed', this);
        },
        lock(lock) {
          this.locked = !!lock;
          this.value = 0;
          this.available = [];
          this.pencil = [];
          $rootScope.$broadcast('cell-value-changed', this);
        }
      };
      return (SudokuSchemaCell);
    }]);
