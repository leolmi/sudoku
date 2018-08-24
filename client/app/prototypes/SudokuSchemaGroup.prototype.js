'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchemaGroup',['util','$rootScope',
    function(util, $rootScope) {


      function getAlignments(cells, coord) {
        return _(cells)
          .groupBy(coord)
          .map(function(cs){
            var values = [];
            cs.forEach(function(c){
              values = _.union(values, c.available);
            });
            var alg = { cells: cs, allvalues: values };
            alg[coord] = cs[0][coord];
            return alg;
          })
          .filter(function(alg, i, cll){
            var v = _.clone(alg.allvalues);
            cll.forEach(function(a){
              if (a!==alg)
                v = _.difference(v, a.allvalues);
            });
            alg.values = v;
            return v.length>0;
          })
          .value();
      }


      const SudokuSchemaGroup = function(type, index) {
        this.id = ''+type+index;
        this.type = type;
        this.index = index;
        this.cells = [];
      };
      SudokuSchemaGroup.prototype = {
        id: '',
        type: '',
        index: -1,
        cells: [],
        getValues: function(exclude) {
          const values = [];
          this.cells.forEach(function(c){
            const v = parseInt(c.value||'0');
            if (v && c!==exclude) values.push(v);
          });
          return values;
        },
        resetAvailables: function() {
          const self = this;
          self.cells.forEach(function(c){
            c.resetAvailables();
            c.error = false;
          });
        },
        // Restituisce vero se le celle in elenco appartengono tutte al gruppo
        contains: function(cells) {
          const self = this;
          return !_.find(cells, function(c){
            return self.cells.indexOf(c)<0;
          });
        },
        getSummary:function() {
          const self = this;
          const summary = [];
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
          const self = this;
          const twinsgroup = _(self.cells)
            .filter(function (c) { return !c.value && c.available.length === 2; })
            .map(function (c) { return {cell: c, code: c.available.join()}; })
            .groupBy('code')
            .filter(function (g) { return g.length === 2; })
            .value();

          return _.map(twinsgroup, function(g) {
            const cells = _.map(g, function(ig){ return ig.cell });
            const hash = _.map(cells, function(c) { return c.index; }).join();
            return { values: g[0].cell.available, cells: cells, hash: hash }
          });
        },
        getAlignments: function() {
          const self = this;
          if (self.type!=='D') return [];
          const alignments = getAlignments(self.cells, 'x');
          const yg = getAlignments(self.cells, 'y');
          Array.prototype.push.apply(alignments, yg);
          return alignments;
        }
      };
      return (SudokuSchemaGroup);
    }]);
