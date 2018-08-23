'use strict';

angular.module('sudokuApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('editor', {
        url: '/',
        templateUrl: 'app/editor/editor.html',
        controller: 'EditorCtrl',
        data: {
          image: 5
        }
      });
  });
