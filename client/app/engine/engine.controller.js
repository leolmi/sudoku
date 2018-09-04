angular.module('sudokuApp')
  .controller('EngineCtrl', ['$scope','util','engineService','algorithms','sudokuService',
    function ($scope, util, engineService, algorithms, sudokuService) {
      $scope.state = engineService.state;
      $scope.status = {
        isopen: false
      };
      $scope.symmetries = util.objToArray(sudokuService.constants.symmetry);
      $scope.stops = util.objToArray(engineService.constants.stops);
      $scope.scores = algorithms.scores;


      $scope.applySymmetry = function(s) {
        $scope.state.options.symmetry = s;
        engineService.schema.setSimmetry(s);
      };

      $scope.applyDifficulty = function(s) {
        $scope.state.options.difficulty = s.name;
      };

      $scope.applyStop = function(s) {
        $scope.state.options.stop.type = s;
      };

      $scope.schemaOptions = {
        provider: engineService.schema
      };

    }]);
