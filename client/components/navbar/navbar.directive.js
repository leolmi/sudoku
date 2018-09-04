'use strict';

angular.module('sudokuApp')
  .directive('sudokuNavBar', ['sudokuService','popupService','$state',
    function(sudokuService, popupService, $state) {
      return {
        restrict: "E",
        templateUrl: 'components/navbar/navbar.html',
        scope: {},
        link: function (scope) {
          scope.state = sudokuService.state;
          scope.toast = popupService.state.toast;

          scope.toggle = function() {
            scope.engine = ($state.current.name !== 'engine');
            (scope.engine) ? $state.go('engine') : $state.go('editor');
          };

          scope.engine = (location.pathname === '/engine');
        }
      }
    }]);
