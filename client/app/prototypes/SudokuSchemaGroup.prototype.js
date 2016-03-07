'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchemaGroup',['util','$rootScope',
    function(util, $rootScope) {


      function getAlignments(cells, coord) {
        return _(cells)
          .groupBy(coord)
          .map(function(cells){
            var values = [];
            cells.forEach(function(c){
              values = _.union(values, c.available);
            });
            var alg = { cells:cells, values:values };
            alg[coord] = cells[0][coord];
            return alg;
          })
          .filter(function(alg, i, cll){
            var v = _.clone(alg.values);
            cll.forEach(function(a){
              if (a!=alg)
                v = _.difference(v, a.values);
            });
            return v.length>0;
          })
          .value();
      }


      var SudokuSchemaGroup = function(type, index) {
        this.id = ''+type+index;
        this.type = type;
        this.index = index;
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
        type: '',
        index: -1,
        cells: [],
        getValues: function() {
          var values = [];
          this.cells.forEach(function(c){
            if (c.value>0)
              values.push(parseInt(c.value));
          });
          return values;
        },
        // Restituisce vero se le celle in elenco appartengono tutte al gruppo
        contains: function(cells) {
          var self = this;
          return !_.find(cells, function(c){
            return self.cells.indexOf(c)<0;
          });
        },
        getSummary:function() {
          var self = this;
          var summary = [];
          for (var i = 0; i < self.cells.length; i++) {
            summary.push({code: 0, hash:'', cells: [], value: (i+1)});
          }
          self.cells.forEach(function (c) {
            c.available.forEach(function (v) {
              summary[v-1].code++;
              summary[v-1].hash += ''+ c.index;
              summary[v-1].cells.push(c);
            });
          });
          return summary;
        },
        // restituisce i gemelli espliciti
        getTwins: function() {
          var self = this;
          var twinsgroup = _(self.cells)
            .filter(function (c) { return !c.value && c.available.length == 2; })
            .map(function (c) { return {cell: c, code: c.available.join()}; })
            .groupBy('code')
            .filter(function (g) { return g.length == 2; })
            .value();

          return _.map(twinsgroup, function(g) {
            var cells = _.map(g, function(ig){ return ig.cell });
            var hash = _.map(cells, function(c) { return c.index; }).join();
            return { values: g[0].cell.available, cells: cells, hash: hash }
          });
        },
        getAlignments: function() {
          var self = this;
          if (self.type!='D') return [];
          var alignments = getAlignments(self.cells, 'x');
          var yg = getAlignments(self.cells, 'y');
          Array.prototype.push.apply(alignments, yg);
          return alignments;
        }
      };
      return (SudokuSchemaGroup);
    }]);
