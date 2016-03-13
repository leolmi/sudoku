'use strict';

angular.module('sudokuApp')
  .provider('algorithms',
    function() {
      var availableAlgorithms = [{
        name:'single cell',
        score: 1,
        proto: 'AlgorithmSingleCell',
        active: true
      },{
        name:'single value',
        score: 5,
        proto: 'AlgorithmSingleValue',
        active: true
      },{
        name:'intersections',
        score: 2,
        proto: 'AlgorithmIntersections',
        active: true
      },{
        name:'twins',
        score: 2,
        proto: 'AlgorithmTwins',
        active: true
      },{
        name:'try',
        score: 100,
        proto: 'AlgorithmTry',
        active: true
      }];

      this.$get = function () {
        return {
          availableAlgorithms: availableAlgorithms
        };
      };
    });
