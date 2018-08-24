'use strict';

angular.module('sudokuApp')
  .directive('sudokuBackground', ['sudokuBkgService','sudokuService',
    function(sudokuBkgService, sudokuService) {
      return {
        restrict: "E",
        template: '<div><div class="top-gradient"></div><div class="sudoku-background" ng-style="{\'background-image\':backgroundImage}"></div></div>',
        scope: {},
        link: function (scope, ele) {
          scope.state = sudokuService.state;
          scope.$watch(function() { return sudokuBkgService.state.url; }, function(){
            scope.backgroundImage = sudokuBkgService.state.url;
          });
        }
      }
    }]);
