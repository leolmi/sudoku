'use strict';

angular.module('sudokuApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('test', {
        url: '/test',
        templateUrl: 'app/test/test.html',
        controller: 'TestCtrl',
        data:{
          image: 5
        }
      });
  });
