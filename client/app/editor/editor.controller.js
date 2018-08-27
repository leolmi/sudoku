'use strict';

angular.module('sudokuApp')
  .controller('EditorCtrl', ['$scope','$http','sudokuService',
    function ($scope,$http,sudokuService) {
      $scope.state = {
        loading: false,
        error: null,
        schemas: []
      };
      $scope.schemaOptions = {};


      function _refreshList() {
        if ($scope.state.loading) return;
        $scope.state.loading = true;
        $scope.state.error = null;
        $http.get('api/schema')
          .then(function (resp) {
            $scope.state.schemas = resp.data;
            $scope.state.loading = false;
          }, function (err) {
            $scope.state.error = err;
            $scope.state.loading = false;
          });
      }

      $scope.open = function(schema) {
        sudokuService.open(schema);
      };

      _refreshList();
    }]);
