'use strict';

angular.module('sudokuApp')
  .provider('algorithms',
    function() {
      var availableAlgorithms = [{
        name:'single value',
        score: 1,
        proto: 'AlgorithmSingleValue'
      },{
        name:'single cell',
        score: 5,
        proto: 'AlgorithmSingleCell'
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
