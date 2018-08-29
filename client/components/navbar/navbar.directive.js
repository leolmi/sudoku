'use strict';

angular.module('sudokuApp')
  .directive('sudokuNavBar', ['sudokuService','popupService',
    function(sudokuService,popupService) {
      return {
        restrict: "E",
        templateUrl: 'components/navbar/navbar.html',
        scope: {},
        link: function (scope) {
          scope.state = sudokuService.state;
          scope.toast = popupService.state.toast;
          scope.toggle = function() {
            scope.state.menu = !scope.state.menu;
          };
        }
      }
    }]);
