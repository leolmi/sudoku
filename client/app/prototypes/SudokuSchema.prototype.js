'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchema',['SudokuSchemaCell','SudokuSchemaGroup','SudokuReportLine',
    function(SudokuSchemaCell, SudokuSchemaGroup, SudokuReportLine) {
      function initValues(schema) {
        return new Array(schema.dimension*schema.dimension);
      }

      function build(schema) {
        // costruisce le celle
        schema.cells = [];
        for (var i = 0; i < (schema.dimension*schema.dimension); i++) {
          schema.cells.push(new SudokuSchemaCell(schema.dimension, i));
        }

        // costruisce i gruppi
        var rank = Math.sqrt(schema.dimension);
        for (var a = 0; a < schema.dimension; a++) {
          var row = new SudokuSchemaGroup('R', a);
          var col = new SudokuSchemaGroup('C', a);
          var dial = new SudokuSchemaGroup('D', a);
          for (var b = 0; b < schema.dimension; b++) {
            row.cells.push(schema.cells[a*schema.dimension+b]);
            col.cells.push(schema.cells[b*schema.dimension+a]);
            dial.cells.push(schema.cells[parseInt(b/rank)*schema.dimension+(b%rank)+((a%rank)*rank)+parseInt(a/rank)*rank*schema.dimension]);
          }
          Array.prototype.push.apply(schema.groups, [row, col, dial]);
        }

        // costruisce i gruppi sulle diagonali
        if (schema.x) {
          var d1 = new SudokuSchemaGroup();
          var d2 = new SudokuSchemaGroup();
          for (var x = 0; x < schema.dimension; x++) {
            d1.cells.push(schema.cells[x+x*schema.dimension]);
            d2.cells.push(schema.cells[(x*schema.dimension)+(schema.dimension-x-1)]);
          }
          Array.prototype.push.apply(schema.groups, [d1, d2]);
        }
      }

      var SudokuSchema = function(options) {
        this.symmetry = 'none';
        this.dimension = 9;
        this.x = false;
        this.values = initValues(this);
        this.fixed = initValues(this);
        this.score = 0;
        this.cells = [];
        this.groups = [];
        this.report = [];
        this.disableLog = false;
        if (_.isObject(options))
          _.extend(this, options);
        build(this);
        if (_.isString(options))
          this.parse(options);
      };
      SudokuSchema.prototype = {
        symmetry: 'none',
        dimension: 9,
        x: false,
        values: [],
        fixed: [],
        score: 0,
        cells: [],
        groups: [],
        report: [],
        disableLog: false,
        getValue: function(x,y) {
          return this.values[(y*9)+x];
        },
        isComplete:function() {
          return _.find(this.cells, function(c){
            return c.isEmpty();
          }) ? false : true;
        },
        isCorrupted:function() {
          return _.find(this.cells, function (c) {
            return c.available.length < 1 && !c.value;
          }) ? true : false;
        },
        isCorreptedOrComplete: function() {
          return this.isComplete() || this.isCorrupted();
        },
        parse:function(txt) {
          var self = this;
          var v = [];
          var re = /(\d)/gm;
          var m;
          while ((m = re.exec(txt)) !== null) {
            if (m.index === re.lastIndex) {
              re.lastIndex++;
            }
            v.push((m[0]>0) ? parseInt(m[0]) : undefined);
          }
          if (v.length>0 && v.length<82) {
            self.values = v;
            self.fixed = _.map(v, function(sv){
              return (sv>0) ? 1 : 0;
            });
          }

          self.values.forEach(function(v, i){
            self.cells[i].setValue(v);
          });
          self.fixed.forEach(function(v, i){
            self.cells[i].fixed = v ? true : false;
          });
        },
        // Salva una riga di log
        // alg: algoritmo, cell: cella interessata, avl:valori esclusi
        log: function(alg, cell, avl) {
          var self = this;
          if (self.disableLog) return;
          self.report.push(new SudokuReportLine(alg, self, cell, avl));
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
        reset: function() {
          this.cells.forEach(function(c){ c.setValue(); });
          this.cells.forEach(function(c){ c.setValue(); });
          this.report = [];
        },
        getScore: function() {
          var self = this;
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
          var cell = undefined;
          this.cells.forEach(function (c, i) {
            if (!c.value && (!cell || cell.available.length > c.available.length))
              cell = c;
          });
          return cell;
        },
        // Restituisce l'elenco delle coppie di celle gemelle
        getTwins: function() {
          var self = this;
          var grouptwins = [];
          self.groups.forEach(function(g) {
            var summary = g.getSummary(self);
            var g1 = _(summary)
              .filter(function(r){ return r.code == 2; })
              .groupBy('hash')
              .filter(function(g){ return g.length == 2; })
              .value();
            Array.prototype.push.apply(grouptwins, g1);
          });

          var twins = [];
          if (grouptwins.length) {
            var ug = _(grouptwins)
              .map(function(t) { return { hash: t[0].hash, twins: t }})
              .groupBy('hash')
              .value();
            _.keys(ug).forEach(function(u){
              var values = _.map(ug[u][0].twins, function(t) { return t.value; });
              var hash = _.map(ug[u][0].twins[0].cells, function(c) { return ''+c.index; }).join();
              twins.push({ values:values, cells: ug[u][0].twins[0].cells, hash: hash});
            });
          }

          //integra i gemelli espliciti
          self.groups.forEach(function(g){
            g.getTwins().forEach(function(gt){
              if (!_.find(twins, function(t){ return t.hash==gt.hash; })) {
                twins.push(gt);
              }
            });
          });

          return twins;
        },
        // Restituisce tutti i gruppi che contengono tutte le celle in elenco
        getGroups: function(cells) {
          var self = this;
          return _.filter(self.groups, function(g) {
            return g.contains(cells);
          });
        },
        checkValues: function(alg, cell, values) {
          var self = this;
          var avl = _.difference(cell.available, values);
          if (avl.length != cell.available.length) {
            var ex = _.difference(cell.available, avl);
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
