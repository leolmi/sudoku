'use strict';

angular.module('sudokuApp')
  .directive('schema', ['$timeout','sudokuService','$compile','solver','util',
    function($timeout, sudokuService, $compile, solver, util) {
      return {
        restrict: "E",
        templateUrl: 'components/schema/schema.html',
        scope: {options:'='},
        link: function (scope, ele) {
          scope.state = sudokuService.state;

          function _defer(action) {
            $timeout(action, 100);
          }

          function _setValue(e, value) {
            e.preventDefault();
            _defer(function() {
              sudokuService.setValue(value);
              if (scope.state.drawing) sudokuService.move(4);
            });
          }

          function _move(e, code) {
            e.preventDefault();
            _defer(function() {
              sudokuService.move(code||(e.which - 37));
            });
          }

          function _toggle(e) {
            e.preventDefault();
            return _defer(function() {
              sudokuService.toggle();
            });
          }

          function _handleKeys(e) {
            // numerici da 0 a 9
            if (e.which>47 && e.which<58){
              _setValue(e, e.which-48);
            } else if (e.which>95 && e.which<106){
              _setValue(e, e.which-96);
            } else {
              console.log('KEY CODE=%s', e.which);
              e.stopPropagation();
              switch(e.which) {
                case 13:
                  return _move(e, 4);
                case 37: //left
                case 38: //up
                case 39: //right
                case 40: //down
                  return _move(e);
                //case 27: //escape (toglie la selezione)
                case 46: //delete (svuota la cella)
                case 8: //backspace (svuota la cella)
                  return _setValue(e, 0);
                case 107:
                  return _toggle(e);
                case 36: //home (switcha da matita a penna)
                  // TODO...
                  return;
                case 67: //'c' clear all
                  return util.safeApply(scope, function() {
                    scope.state.schema.reset();
                  });
                case 82: //'r' resolve
                  return util.safeApply(scope, function() {
                    solver.solveAll(scope.state.schema);
                  });
                case 83: //'s' schema
                  return util.safeApply(scope, function() {
                    if (!scope.state.drawing) {
                      scope.state.schema.reset(true);
                      scope.state.x = 0;
                      scope.state.y = 0;
                      scope.state.drawing = true;
                    } else {
                      scope.state.schema.fix();
                      scope.state.drawing = false;
                    }
                  });
              }
            }
          }

          window.addEventListener("keydown", _handleKeys, false);

          function _rebuild() {
            const PRC = .01;
            const info = sudokuService.state.schema;
            const cnv = $('#schema-canvas', ele);
            const size = Math.min(cnv.width(),cnv.height());
            const dh = size / info.dimension;
            const gh = size / info.rank;
            const dhb = dh*PRC;
            const dw = size / info.dimension;
            const gw = size / info.rank;
            const dwb = dw*PRC;
            const fs = (dw*.9).toFixed(0);
            // BACKGROUND
            var content = '<rect class="schema-board" x="0" y="0" width="'+size+'" height="'+size+'" style="fill:rgba(200,200,200,.8)" />';
            // LINES
            for(var s = 1;s < info.dimension; s++) {
              const dx = s * dw;
              const dy = s * dh;
              const w = s % info.rank === 0 ? 3 : 1;
              content += '<line class="schema-line" x1="' + dx + '" y1="0" x2="' + dx + '" y2="' + size + '" style="stroke-width:' + w + '" />' +
                '<line class="schema-line" x1="0" y1="' + dy + '" x2="' + size + '" y2="' + dy + '" style="stroke-width:' + w + '" />';
            }
            // BOARD
            for(var x = 0;x < info.dimension; x++) {
              for (var y = 0; y < info.dimension; y++) {
                const rx = dw * x;
                const ry = dh * y;
                content += '<rect class="schema-cell" ng-click="cellClick('+x+','+y+')" '+
                  'ng-class="{\'current\':'+x+'===state.x&&'+y+'===state.y, \'error\':!!state.schema.cell('+x+','+y+').error,'+
                  ' \'fixed\':!!state.schema.cell('+x+','+y+').fixed}" x="'+(rx+dwb)+'" y="'+(ry+dhb)+'" width="'+(dw-2*dwb)+'" height="'+(dh-2*dhb)+'"></rect>' +
                  '<text class="schema-cell-text" ng-class="{\'fixed\':!!state.schema.cell('+x+','+y+').fixed}" x="'+(rx+dw/2)+'" y="'+(ry+6*dhb+dh/2)+'" text-anchor="middle"'+
                  'dominant-baseline="middle" style="font-size:'+fs+'px;">{{state.schema.cell('+x+','+y+').text()}}</text>';
              }
            }
            // COMPONENT
            const svg = '<svg ng-attr-height="'+size+'px" ng-attr-width="'+size+'px" style="height:'+size+'px;width:'+size+'px;display:block;margin:auto;">' + content + '</svg>';
            const sch = $compile(svg)(scope);
            cnv.html(sch);
          }


          scope.cellClick = function(x,y){
            //const cnv = $('#schema-canvas', ele);
            //cnv.focus();
            $(ele).focus();
            sudokuService.select(x,y);
            const cell = sudokuService.state.schema.cell(x,y);
            console.log('CURRENT CELL',cell);
          };

          ele.on("mresize", function() {
            $timeout(_rebuild);
          });

          $timeout(_rebuild);
        }
      }
    }]);
