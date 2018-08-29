'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchema',['$rootScope','SudokuSchemaCell','SudokuSchemaGroup','SudokuReportLine','util',
    function($rootScope, SudokuSchemaCell, SudokuSchemaGroup, SudokuReportLine, util) {
      // function initValues(schema) {
      //   return new Array(schema.dimension*schema.dimension);
      // }

      function build(schema) {
        // costruisce le celle
        schema.cells = [];
        for (var i = 0; i < (schema.dimension*schema.dimension); i++) {
          schema.cells.push(new SudokuSchemaCell(schema.dimension, i));
        }
        if (((schema._original||{}).cells||[]).length === schema.cells.length) {
          schema.cells.forEach((c, i) => c.pencil = _.clone(schema._original.cells[i].pencil));
        }

        // costruisce i gruppi
        schema.groups = [];
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
        schema.report = _.map(schema.report, (rl) => {
          const line = new SudokuReportLine(rl);
          line.load(rl);
          return line;
        });
      }

      function _cellGroups(schema, origin) {
        return _.filter(schema.groups, (g) => g.cells.indexOf(origin) > -1);
      }

      function _getValues(groups, cell) {
        if (!groups) return [];
        if (!_.isArray(groups)) groups = [groups];
        let v = [];
        groups.forEach((g) => v = _.union(v, g.getValues(cell)));
        return v;
      }

      function _refreshAvailables(schema, origin) {
        const groups = origin ? _cellGroups(schema, origin) : schema.groups;
        groups.forEach((g) => g.resetAvailables());
        schema.cells.forEach((c) => {
          const gs = _cellGroups(schema, c);
          const values = _getValues(gs, c);
          c.removeAvailables(values);
          c.error = !c.fixed && ((!c.value && c.available.length<=0) ||
            (!!c.value && values.indexOf(c.value)>-1));
        });
      }

      function _toValues(txt) {
        const values = [];
        const re = /(\d)/gm;
        let m;
        while ((m = re.exec(txt)) !== null) {
          if (m.index === re.lastIndex) {
            re.lastIndex++;
          }
          values.push((m[0]>0) ? parseInt(m[0]) : 0);
        }
        return values;
      }

      function _values(schema) {
        return _.map(schema.cells||[], (c) => c.fixed ? c.value : 0).join('');
      }

      function _reset(schema) {
        schema.values = _values(schema);
        schema.report = [];
        schema.meta = {};
        schema.name = null;
        schema.score = 0;
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
        self.meta = {};
        self.disableLog = false;
        self.pencil = false;
        if (_.isObject(options)) {
          self._original = options;
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
          if (!!cell && self.cells.indexOf(cell)>-1) _refreshAvailables(self, cell);
        });
        _refreshAvailables(self);
        self.values = _values(self);
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
        meta: null,
        disableLog: false,
        pencil: false,
        fixed: '',
        checkResult() {
          $rootScope.$broadcast('need-tobe-solved', this);
        },
        checkName() {
          if (this.name) return;
          const hash = util.hash(this.values);
          this.name = this.dimension + 'x' + this.dimension + ' ' + this.fixedCount() +
            'num (' + (this.score ? this.score : 'nn') + ') [' + hash + ']';
        },
        isDoing() {
          return !!_.find(this.cells, function(c){
            return !c.isEmpty() && !c.fixed;
          });
        },
        isComplete() {
          return !_.find(this.cells, function(c){
            return c.isEmpty();
          });
        },
        isCorrupted() {
          return !!_.find(this.cells, function (c) {
            return c.available.length < 1 && !c.value;
          });
        },
        isCorreptedOrComplete() {
          return this.isComplete() || this.isCorrupted();
        },
        validateCoord(x, y) {
          return (_.isNumber(x) && x>=0 && x<this.dimension &&
            _.isNumber(y) && y>=0 && y<this.dimension);
        },
        cell(x,y) {
          return this.cells[y*this.dimension + x];
        },
        parse(txt) {
          const self = this;
          _toValues(txt).forEach((v, i) => {
            self.cells[i].value = v;
            self.cells[i].fixed = !!v;
          });
          _reset(self);
          $rootScope.$broadcast('cell-value-changed');
        },
        // Salva una riga di log
        // alg: algoritmo, cell: cella interessata, avl:valori esclusi
        log(alg, cell, avl) {
          const self = this;
          if (self.disableLog) return;
          self.report.push(new SudokuReportLine(alg, self, cell, avl));
        },
        //converte in valori fissi quelli presenti
        fix() {
          const self = this;
          self.cells.forEach((c) => {
            c.fixed = !!c.value;
            c.available = [];
            c.pencil = [];
          });
          _reset(self);
          _refreshAvailables(self);
          $rootScope.$broadcast('cell-value-changed');
        },
        cloneBy(other) {
          this.cells.forEach((c,i) => {
            c.value = other.cells[i].value;
            c.fixed = other.cells[i].fixed;
            c.available = _.clone(other.cells[i].available);
          });
          this.report = _.map(other.report, (l) => _.clone(l));
        },
        reset(all) {
          const self = this;
          self.cells.forEach((c) => {
            if (!c.fixed || all) {
              c.value = 0;
              c.pencil = [];
              c.fixed = false;
            }
          });
          if (all) _reset(self);
          _refreshAvailables(self);
          $rootScope.$broadcast('cell-value-changed');
        },
        getScore() {
          const self = this;
          self.score = 'unknown';
          if (self.report.length) {
            self.score = 0;
            self.report.forEach((l) => self.score += l.score);
          }
          return self.score;
        },
        // Restituisce la prima cella con il minor numero di valori possibili
        getMinAvailable() {
          let cell = undefined;
          this.cells.forEach((c) => {
            if (!c.value && (!cell || (c.available.length > 0 && cell.available.length > c.available.length))) cell = c;
          });
          return cell;
        },
        // Restituisce l'elenco delle coppie di celle gemelle
        getTwins() {
          const self = this;
          const grouptwins = [];
          self.groups.forEach((g) => {
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
              .map((t) => { return { hash: t[0].hash, twins: t }})
              .groupBy('hash')
              .value();
            _.keys(ug).forEach((u) => {
              const values = _.map(ug[u][0].twins, (t) => t.value);
              const hash = _.map(ug[u][0].twins[0].cells, (c) => ''+c.index).join();
              twins.push({ values:values, cells: ug[u][0].twins[0].cells, hash: hash});
            });
          }

          //integra i gemelli espliciti
          self.groups.forEach(function(g){
            g.getTwins().forEach((gt) => {
              if (!_.find(twins, function(t){ return t.hash===gt.hash; })) twins.push(gt);
            });
          });

          return twins;
        },
        fixedCount() {
          return _.filter(this.cells, ['fixed', true]).length;
        },
        valuesCount() {
          return _.filter(this.cells, (c) => !!c.value && !c.fixed).length;
        },
        // Restituisce tutti i gruppi che contengono tutte le celle in elenco
        getGroups(cells) {
          const self = this;
          return _.filter(self.groups, (g) => g.contains(cells));
        },
        checkValues(alg, cell, values) {
          const self = this;
          const avl = _.difference(cell.available, values);
          if (avl.length !== cell.available.length) {
            const ex = _.difference(cell.available, avl);
            cell.available = avl;
            self.log(alg, cell, ex);
            return true;
          }
          return false;
        },
        keep(txt) {
          const self = this;
          _toValues(txt).forEach((v, i) => {
            if (!self.cells[i].fixed) self.cells[i].value = v;
          });
          _refreshAvailables(self);
          $rootScope.$broadcast('cell-value-changed');
        },
        refreshAvailables() {
          _refreshAvailables(this);
        }
      };

      SudokuSchema.prototype.toString = function() {
        return _.map(this.cells, (c) => c.value ? c.value : 0).join('');
      };

      return (SudokuSchema);
    }]);
