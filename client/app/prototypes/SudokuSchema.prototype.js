'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchema',['$rootScope','SudokuSchemaCell','SudokuSchemaGroup','SudokuReportLine',
    function($rootScope, SudokuSchemaCell, SudokuSchemaGroup, SudokuReportLine) {
      // function initValues(schema) {
      //   return new Array(schema.dimension*schema.dimension);
      // }

      function build(schema) {
        // costruisce le celle
        schema.cells = [];
        for (var i = 0; i < (schema.dimension*schema.dimension); i++) {
          schema.cells.push(new SudokuSchemaCell(schema.dimension, i));
        }

        // costruisce i gruppi
        schema.rank = Math.sqrt(schema.dimension);
        for (var a = 0; a < schema.dimension; a++) {
          const row = new SudokuSchemaGroup('R', a);
          const col = new SudokuSchemaGroup('C', a);
          const dial = new SudokuSchemaGroup('D', a);
          for (var b = 0; b < schema.dimension; b++) {
            row.cells.push(schema.cells[a*schema.dimension+b]);
            col.cells.push(schema.cells[b*schema.dimension+a]);
            dial.cells.push(schema.cells[parseInt(b/schema.rank)*schema.dimension+(b%schema.rank)+((a%schema.rank)*schema.rank)+parseInt(a/schema.rank)*schema.rank*schema.dimension]);
          }
          Array.prototype.push.apply(schema.groups, [row, col, dial]);
        }

        // costruisce i gruppi sulle diagonali
        if (schema.x) {
          const d1 = new SudokuSchemaGroup();
          const d2 = new SudokuSchemaGroup();
          for (var x = 0; x < schema.dimension; x++) {
            d1.cells.push(schema.cells[x+x*schema.dimension]);
            d2.cells.push(schema.cells[(x*schema.dimension)+(schema.dimension-x-1)]);
          }
          Array.prototype.push.apply(schema.groups, [d1, d2]);
        }
      }

      function resolve(schema) {
        schema.report = _.map(schema.report, function(rl){
          const line = new SudokuReportLine(rl);
          line.load(rl);
          return line;
        });
      }

      function _cellGroups(schema, origin) {
        return _.filter(schema.groups, function (g) {
          return g.cells.indexOf(origin) > -1;
        })
      }

      function _getValues(groups, cell) {
        if (!groups) return [];
        if (!_.isArray(groups)) groups = [groups];
        let v = [];
        groups.forEach(function(g){
          v = _.union(v, g.getValues(cell));
        });
        return v;
      }

      function _refreshAvailables(schema, origin) {
        const groups = origin ? _cellGroups(schema, origin) : schema.groups;
        groups.forEach(function (g) {
          g.resetAvailables();
        });
        schema.cells.forEach(function(c){
          const gs = _cellGroups(schema, c);
          const values = _getValues(gs, c);
          c.removeAvailables(values);
          c.error = !c.fixed && ((!c.value && c.available.length<=0) ||
            (!!c.value && values.indexOf(c.value)>-1));
        });
      }

      const SudokuSchema = function(options) {
        const self = this;
        self.symmetry = 'none';
        self.dimension = 9;
        self.rank = 3;
        self.x = false;
        self.score = 0;
        self.cells = [];
        self.groups = [];
        self.report = [];
        self.disableLog = false;
        if (_.isObject(options)) {
          _.extend(self, options);
          resolve(self);
        }
        build(self);
        if (_.isString(options)) {
          self.parse(options);
        } else if (_.isString(self.values)) {
          self.parse(self.values);
        }
        $rootScope.$on('cell-value-changed', function(e, cell){
          if (self.cells.indexOf(cell)>-1) _refreshAvailables(self, cell);
        });
        _refreshAvailables(self);
      };
      SudokuSchema.prototype = {
        symmetry: 'none',
        dimension: 9,
        rank: 3,
        x: false,
        score: 0,
        cells: null,
        groups: null,
        report: null,
        disableLog: false,
        checkResult: function() {
          $rootScope.$broadcast('need-tobe-solved', this);
        },
        isDoing: function() {
          return !!_.find(this.cells, function(c){
            return !c.isEmpty() && !c.fixed;
          });
        },
        isComplete:function() {
          return !_.find(this.cells, function(c){
            return c.isEmpty();
          });
        },
        isCorrupted:function() {
          return !!_.find(this.cells, function (c) {
            return c.available.length < 1 && !c.value;
          });
        },
        isCorreptedOrComplete: function() {
          return this.isComplete() || this.isCorrupted();
        },
        validateCoord: function(x, y) {
          return (_.isNumber(x) && x>=0 && x<this.dimension &&
            _.isNumber(y) && y>=0 && y<this.dimension);
        },
        cell: function(x,y) {
          return this.cells[y*this.dimension + x];
        },
        parse:function(txt) {
          const self = this;
          const v = [];
          const re = /(\d)/gm;
          let m;
          while ((m = re.exec(txt)) !== null) {
            if (m.index === re.lastIndex) {
              re.lastIndex++;
            }
            v.push((m[0]>0) ? parseInt(m[0]) : 0);
          }
          v.forEach(function(v, i){
            self.cells[i].value = v;
            self.cells[i].fixed = !!v;
          });
        },
        // Salva una riga di log
        // alg: algoritmo, cell: cella interessata, avl:valori esclusi
        log: function(alg, cell, avl) {
          let self = this;
          if (self.disableLog) return;
          self.report.push(new SudokuReportLine(alg, self, cell, avl));
        },
        //converte in valori fissi quelli presenti
        fix: function() {
          this.cells.forEach(function(c){
            c.fixed = !!c.value;
          });
        },
        cloneBy: function(other) {
          this.cells.forEach(function(c,i){
            c.value = other.cells[i].value;
            c.fixed = other.cells[i].fixed;
            c.available = _.clone(other.cells[i].available);
          });
          this.report = _.map(other.report, function(l) {
            return _.clone(l);
          });
        },
        reset: function(all) {
          const self = this;
          self.cells.forEach(function(c){
            if (!c.fixed || all) {
              c.value = 0;
              c.pencil = [];
              c.fixed = false;
            }
          });
          _refreshAvailables(self);
        },
        getScore: function() {
          const self = this;
          self.score = 'unknown';
          if (self.report.length) {
            self.score = 0;
            self.report.forEach(function(l){
              self.score += l.score;
            });
          }
          return self.score;
        },
        // Restituisce la prima cella con il minor numero di valori possibili
        getMinAvailable: function() {
          let cell = undefined;
          this.cells.forEach(function (c) {
            if (!c.value && (!cell || cell.available.length > c.available.length))
              cell = c;
          });
          return cell;
        },
        // Restituisce l'elenco delle coppie di celle gemelle
        getTwins: function() {
          const self = this;
          const grouptwins = [];
          self.groups.forEach(function(g) {
            const summary = g.getSummary(self);
            const g1 = _(summary)
              .filter(function(r){ return r.code === 2; })
              .groupBy('hash')
              .filter(function(g){ return g.length === 2; })
              .value();
            Array.prototype.push.apply(grouptwins, g1);
          });

          const twins = [];
          if (grouptwins.length) {
            const ug = _(grouptwins)
              .map(function(t) { return { hash: t[0].hash, twins: t }})
              .groupBy('hash')
              .value();
            _.keys(ug).forEach(function(u){
              const values = _.map(ug[u][0].twins, function(t) { return t.value; });
              const hash = _.map(ug[u][0].twins[0].cells, function(c) { return ''+c.index; }).join();
              twins.push({ values:values, cells: ug[u][0].twins[0].cells, hash: hash});
            });
          }

          //integra i gemelli espliciti
          self.groups.forEach(function(g){
            g.getTwins().forEach(function(gt){
              if (!_.find(twins, function(t){ return t.hash===gt.hash; })) {
                twins.push(gt);
              }
            });
          });

          return twins;
        },
        fixedCount: function() {
          return _.filter(this.cells, ['fixed', true]).length;
        },
        // Restituisce tutti i gruppi che contengono tutte le celle in elenco
        getGroups: function(cells) {
          const self = this;
          return _.filter(self.groups, function(g) {
            return g.contains(cells);
          });
        },
        checkValues: function(alg, cell, values) {
          const self = this;
          const avl = _.difference(cell.available, values);
          if (avl.length !== cell.available.length) {
            const ex = _.difference(cell.available, avl);
            cell.available = avl;
            self.log(alg, cell, ex);
            return true;
          }
          return false;
        }
      };

      SudokuSchema.prototype.toString = function() {
        return _.map(this.cells, function(c){ return c.value ? c.value : 0; }).join('');
      };

      return (SudokuSchema);
    }]);
