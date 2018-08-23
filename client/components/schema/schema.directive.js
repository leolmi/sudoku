'use strict';

angular.module('sudokuApp')
  .directive('schema', ['$timeout','schemaService','$compile',
    function($timeout, schemaService, $compile) {
      return {
        restrict: "E",
        templateUrl: 'components/schema/schema.html',
        scope: {options:'='},
        link: function (scope, ele) {

          const provider = (scope.options||{}).provider||schemaService;

          scope.state = provider.state;

          function _rebuild() {
            const PRC = .01;
            const info = provider.getInfo();
            const cnv = $('#schema-canvas', ele);
            const size = Math.min(cnv.width(),cnv.height());
            const dh = size / info.h;
            const gh = size / info.hg;
            const dhb = dh*PRC;
            const dw = size / info.w;
            const gw = size / info.wg;
            const dwb = dw*PRC;
            var content = '<rect x="0" y="0" width="'+size+'" height="'+size+'" style="fill:rgba(200,200,200,.8)" />';
            for(var x = 1;x < info.wg; x++) {
              const rx = gw * x;
              content += '<rect class="schema-group" x="' + (rx - dwb) + '" y="0" width="' + (2 * dwb) + '" height="' + size + '" />';
            }
            for (var y = 1; y < info.hg; y++) {
              const ry = gh * y;
              content += '<rect class="schema-group" x="0" y="' + (ry - dwb) + '" width="' + size + '" height="' + (2 * dwb) + '" />';
            }
            for(var x = 0;x < info.w; x++) {
              for (var y = 0; y < info.h; y++) {
                const rx = dw * x;
                const ry = dh * y;
                content += '<rect class="schema-cell" ng-click="cellClick('+x+','+y+')" ng-class="{\'current\':'+x+'===state.x&&'+y+'===state.y}" '+
                  'x="'+(rx+dwb)+'" y="'+(ry+dhb)+'" width="'+(dw-2*dwb)+'" height="'+(dh-2*dhb)+'" />';
              }
            }
            const svg = '<svg ng-attr-height="'+size+'px" ng-attr-width="'+size+'px" style="height:'+size+'px;width:'+size+'px;display:block;margin:auto;">' + content + '</svg>';
            const sch = $compile(svg)(scope);
            cnv.html(sch);
          }

          function _defer(action) {
            $timeout(action, 100);
          }

          function _setValue(e, value) {
            e.preventDefault();
            _defer(function() {
              provider.setValue(value);
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

          ele.bind("keydown keypress", function (e) {
            // numerici da 0 a 9
            if (e.which>47 && e.which<58){
              _setValue(e, e.which-48);
            } else {
              //console.log('KEY CODE=%s', e.which);
              switch(e.which) {
                case 13:
                  return _move(e, 2);
                case 37: //left
                case 38: //up
                case 39: //right
                case 40: //down
                  return _move(e);
                //case 27: //escape (toglie la selezione)
                case 46: //d elete (svuota la cella)
                case 8: //backspace (svuota la cella)
                  _setValue(e, 0);
                case 107:
                  return _toggle(e);
                case 36: //home (switcha da matita a penna)
                  return;
              }
            }
          });

          scope.cellClick = function(x,y){
            const cnv = $('#schema-canvas', ele);
            cnv.focus();
            provider.select(x,y);
          };

          ele.on("mresize", _rebuild);

          $timeout(_rebuild);
        }
      }
    }]);
