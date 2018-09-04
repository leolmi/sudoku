'use strict';

angular.module('sudokuApp')
  .directive('schema', ['$timeout','sudokuService','$compile','solver','util','popupService',
    function($timeout, sudokuService, $compile, solver, util, popupService) {
      return {
        restrict: "E",
        templateUrl: 'components/schema/schema.html',
        scope: {options:'='},
        link: function (scope, ele) {
          const provider = (scope.options||{}).provider||sudokuService;
          scope.state = provider.state;

          function _defer(action) {
            $timeout(action, 100);
          }

          function _setValue(e, value) {
            e.preventDefault();
            _defer(function() {
              provider.setValue(value);
              if (scope.state.drawing && !scope.state.lockAutoMove) provider.move(4);
            });
          }

          function _move(e, code) {
            e.preventDefault();
            _defer(function() {
              provider.move(code||(e.which - 37));
            });
          }

          function _toggle(e) {
            e.preventDefault();
            return _defer(function() {
              provider.toggle();
            });
          }

          function _handleKeys(e) {
            if (popupService.state.active) return;
            // numerici da 0 a 9
            if (e.which>47 && e.which<58){
              _setValue(e, e.which-48);
            } else if (e.which>95 && e.which<106){
              _setValue(e, e.which-96);
            } else {
              console.log('KEY CODE=%s', e.which);
              e.stopPropagation();
              switch(e.which) {
                case 13:  // INVIO
                  return _move(e, 4);
                case 37:  // LEFT
                case 38:  // UP
                case 39:  // RIGHT
                case 40:  // DOWN
                  return _move(e);
                //case 27: // ESCAPE (toglie la selezione)
                case 46:  // DELETE (svuota la cella)
                case 8:   // BACKSPACE (svuota la cella)
                  return _setValue(e, 0);
                case 107:
                  return _toggle(e);
                case 36:  // HOME (switcha da matita a penna)
                  // TODO...
                  return;
                case 65:  // 'A' availables for cell
                  return provider.cell().pencilize();
                case 67:  // 'C' clear all
                  return provider.reset(scope);
                case 82:  // 'R' resolve
                  return provider.solve(scope);
                case 83:  // 'S' schema
                  return provider.toggle(scope);
              }
            }
          }

          window.addEventListener("keydown", _handleKeys, false);

          function _rebuild() {
            const PRC = .01;
            const info = provider.state.schema;
            const cnv = $('#schema-canvas', ele);
            const size = Math.min(cnv.width(),cnv.height());
            const dh = size / info.dimension;
            const gh = size / info.rank;
            const dhb = dh*PRC;
            const dw = size / info.dimension;
            const gw = size / info.rank;
            const dwb = dw*PRC;
            const fs = (dw*.9).toFixed(0);
            const fss = (dw*.22).toFixed(0);
            const dws = dw / 3;
            // BACKGROUND
            let content = '<rect class="schema-board" x="0" y="0" width="'+size+'" height="'+size+'" style="fill:rgba(200,200,200,.8)" />';
            // LINES
            for(var s = 1;s < info.dimension; s++) {
              const dx = s * dw;
              const dy = s * dh;
              const w = s % info.rank === 0 ? 3 : 1;
              content += '<line class="schema-line" x1="' + dx + '" y1="0" x2="' + dx + '" y2="' + size + '" style="stroke-width:' + w + '" />' +
                '<line class="schema-line" x1="0" y1="' + dy + '" x2="' + size + '" y2="' + dy + '" style="stroke-width:' + w + '" />';
            }

            const pencil_text = '<text ng-show="state.schema.cell({x},{y}).has({value})" x="{dx}" y="{dy}">{value}</text>'
            // BOARD
            for(var x = 0;x < info.dimension; x++) {
              for (var y = 0; y < info.dimension; y++) {
                const rx = dw * x;
                const ry = dh * y;
                let pencil = '';
                for (var p = 0; p < info.dimension; p++) {
                  const dpx = [0,3,6].indexOf(p)>-1 ? -dws : ([2,5,8].indexOf(p)>-1 ? dws : 0);
                  const dpy = (p<3) ? -dws : ((p<6) ? 0 : dws);
                  pencil += util.format(pencil_text, {x:x, y:y, dx:rx+dw/2+dpx, dy:ry+6*dhb+dh/2+dpy, value:p+1});
                }
                content += '<rect class="schema-cell" ng-mouseenter="cellEnter('+x+','+y+')" ng-click="cellClick('+x+','+y+')" '+
                  'ng-class="{\'current\':'+x+'===state.x&&'+y+'===state.y, \'error\':!!state.schema.cell('+x+','+y+').error,'+
                  ' \'fixed\':!!state.schema.cell('+x+','+y+').fixed, \'locked\':!!state.schema.cell('+x+','+y+').locked}" ' +
                  'x="'+(rx+dwb)+'" y="'+(ry+dhb)+'" width="'+(dw-2*dwb)+'" height="'+(dh-2*dhb)+'"></rect>' +
                  '<text class="schema-cell-text" ng-class="{\'fixed\':!!state.schema.cell('+x+','+y+').fixed}" x="'+(rx+dw/2)+'" y="'+(ry+6*dhb+dh/2)+'" text-anchor="middle"'+
                  'dominant-baseline="middle" style="font-size:'+fs+'px;">{{state.schema.cell('+x+','+y+').text()}}</text>' +
                  '<g style="font-size:'+fss+'px" class="pencil" dominant-baseline="middle" text-anchor="middle">' + pencil + '</g>';
              }
            }
            // COMPONENT
            const svg = '<svg ng-attr-height="'+size+'px" ng-attr-width="'+size+'px" style="height:'+size+'px;width:'+size+'px;display:block;margin:auto;">' + content + '</svg>';
            const sch = $compile(svg)(scope);
            cnv.html(sch);
          }


          scope.cellClick = function(x,y){
            $(ele).focus();
            const cell = provider.select(x, y, null, 'click');
            console.log('CURRENT CELL', cell);
          };

          scope.cellEnter = function(x,y){
            if (provider.state.drawing) provider.select(x,y);
          };


          ele.on("mresize", () => $timeout(_rebuild));

          $timeout(_rebuild);
        }
      }
    }]);
