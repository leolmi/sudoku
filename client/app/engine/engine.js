'use strict';

angular.module('sudokuApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('engine', {
        url: '/engine',
        templateUrl: 'app/engine/engine.html',
        controller: 'EngineCtrl'
      });
  });
