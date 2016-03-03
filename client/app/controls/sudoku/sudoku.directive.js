'use strict';

angular.module('sudokuApp')
  .directive('sudoku',['SudokuSchema','$timeout','$rootScope',
    function(SudokuSchema,$timeout,$rootScope) {
      return {
        restrict: "E",
        templateUrl: 'app/controls/sudoku/sudoku.html',
        scope: { options:'=' },
        link: function (scope, ele, atr) {
          scope.schema = (scope.options instanceof SudokuSchema) ?
            scope.options : new SudokuSchema(scope.options);
          scope.structure = {
            rowrank: 3,
            colrank: 3,
            rows:new Array(scope.schema.dimension),
            cols:new Array(scope.schema.dimension)
          };
          scope.current = {
            x: 0,
            y: 0,
            is: function (x, y) {
              return (x == this.x && y == this.y);
            },
            getLineCode: function() {
              return this.y*scope.schema.dimension + this.x;
            },
            select:function (x, y) {
              this.x = x;
              this.y = y;
              $rootScope.$broadcast('selected-cell-changed', {current:scope.schema.cells[this.getLineCode()]});
            },
            setValue: function(v) {
              if (this.isLocked()) return;
              var pos = (scope.schema.dimension * this.y + this.x);
              scope.schema.cells[pos].setValue(v);
            },
            move: function(direction) {
              var pos = (scope.schema.dimension * this.y + this.x);
              switch(direction) {
                case 0: pos = (pos>0) ? pos-1 : 80; break; //left
                case 1: pos = (pos>9) ? pos-9 : 9-pos; break; //up
                case 2: pos = (pos<80) ? pos+1 : 0; break; //right
                case 3: pos = (pos<72) ? pos+9 : 9-(80-pos) ; break;//down
              }
              this.x = (pos % 9);
              this.y = parseInt(pos / 9);
            },
            isLocked:function() {
              var pos = (scope.schema.dimension * this.y + this.x);
              return scope.schema.fixed[pos];
            },
            toggle:function() {
              var pos = (scope.schema.dimension * this.y + this.x);
              if (scope.schema.values[pos]) {
                scope.schema.fixed[pos] = scope.schema.fixed[pos] ? undefined : 1;
              }
            }
          };

          function deferExec(action) {
            $timeout(function(){
              action();
            }, 100);
          }

          ele.bind("keydown keypress", function (event) {
            // numerici da 0 a 9
            if (event.which>47 && event.which<58){
              event.preventDefault();
              deferExec(function() {
                scope.current.setValue(event.which-48);
              });
            }
            else {
              switch(event.which) {
                case 37: //left
                case 38: //up
                case 39: //right
                case 40: //down
                  event.preventDefault();
                  return deferExec(function() {
                    scope.current.move(event.which - 37);
                  });
                //case 27: //escape (toglie la selezione)
                case 46: //delete (svuota la cella)
                case 8: //backspace (svuota la cella)
                  event.preventDefault();
                  return deferExec(function() {
                    scope.current.setValue(0);
                  });
                case 107:
                  event.preventDefault();
                  return deferExec(function() {
                    scope.current.toggle();
                  });
                case 36: //home (switcha da matita a penna)
                  return;
              }
            }
          });

          $rootScope.$on('cell-value-changed', function(e, data){
            scope.complete = scope.schema.isComplete();
            scope.corrupted = scope.schema.isCorrupted();
          })
        }
      }
    }]);
