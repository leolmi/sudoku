'use strict';

angular.module('sudokuApp')
  .factory('SudokuSchema',['SudokuSchemaCell','SudokuSchemaGroup',
    function(SudokuSchemaCell, SudokuSchemaGroup) {
      function initValues(schema) {
        return new Array(schema.dimension*schema.dimension);
      }

      function build(schema) {
        // costruisce le celle
        schema.cells = [];
        for (var r = 0; r < (schema.dimension*schema.dimension); r++) {
          schema.cells.push(new SudokuSchemaCell(schema.dimension));
        }

        // costruisce i gruppi
        var rank = Math.sqrt(schema.dimension);
        for (var a = 0; a < schema.dimension; a++) {
          var row = new SudokuSchemaGroup();
          var col = new SudokuSchemaGroup();
          var dial = new SudokuSchemaGroup();
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
        getValue: function(x,y) {
          return this.values[(y*9)+x];
        },
        isComplete:function() {
          return !_.find(this.cells, function(c){
            return c.isEmpty();
          });
        },
        isWrong:function() {
          return _.find(this.cells, function (c) {
            return c.available.length <= 0;
          });
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
        log: function(msg) {
          this.report.push(msg);
        },
        clone: function() {
          return new SudokuSchema(this);
        }
      };

      return (SudokuSchema);
    }]);
