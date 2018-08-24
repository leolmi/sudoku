'use strict';

angular.module('sudokuApp')
  .directive('sudokuNavBar', ['sudokuService',
    function(sudokuService) {
      return {
        restrict: "E",
        templateUrl: 'components/navbar/navbar.html',
        scope: {},
        link: function (scope) {
          scope.state = sudokuService.state;
          scope.toggle = function() {
            scope.state.menu = !scope.state.menu;
          };
        }
      }
    }]);
