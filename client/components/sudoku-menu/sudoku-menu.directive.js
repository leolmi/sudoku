'use strict';

angular.module('sudokuApp')
  .directive('sudokuMenu', ['sudokuService','$state',
    function(sudokuService, $state) {
      return {
        restrict: "E",
        templateUrl: 'components/sudoku-menu/sudoku-menu.html',
        scope: {},
        link: function (scope, ele) {
          scope.state = sudokuService.state;

          // engine
          // board
          // -----------------


          // > board
          //   - open
          //   - save
          //   - resolve
          //   - clear
          //   - reset

          // > engine
          //   - open
          //   - save
          //   - resolve
          //   - clear
          //   - reset

          scope.buttons = [{
            icon: 'fa-th',
            title: 'Schema',
            desc: 'Player di schemi sudoku con possibilità di scriverne propri e risolverli',
            click: function(e) {
              $state.go('editor');
              scope.state.menu = false;
            }
          }, {
            icon: 'fa-cog',
            title: 'Generatore',
            desc: 'Generatore di schemi sudoku con opzioni su simmetria, difficoltà, ecc...',
            click: function(e) {
              $state.go('engine');
              scope.state.menu = false;
            }
          }];



        }
      }
    }]);
