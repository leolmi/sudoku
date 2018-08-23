'use strict';

angular.module('sudokuApp')
  .controller('EditorCtrl', ['$scope', 'schemaService',
    function ($scope, schemaService) {
      $scope.schemaOptions = {
        provider: schemaService
      }
    }]);
