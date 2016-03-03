'use strict';

angular.module('sudokuApp')
  .provider('algorithms',
    function() {
      var availableAlgorithms = [{
        name:'single cell',
        score: 1,
        proto: 'AlgorithmSingleCell'
      },{
        name:'single value',
        score: 5,
        proto: 'AlgorithmSingleValue'
      //},{
      //  name:'intersections',
      //  score: 2,
      //  proto: 'AlgorithmIntersections'
      //},{
      //  name:'twins',
      //  score: 2,
      //  proto: 'AlgorithmTwins'
      //},{
      //  name:'try',
      //  score: 20,
      //  proto: 'AlgorithmTry'
      }];

      this.$get = function () {
        return {
          availableAlgorithms: availableAlgorithms
        };
      };
    });
