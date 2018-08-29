'use strict';

angular.module('sudokuApp')
  .provider('algorithms',
    function() {
      const _algorithms = [{
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

      const _scores = [
        {name:'unknown', max:1, color:'#ffffff'},
        {name:'very easy', code:'very-easy', max:80, color:'#40de7b'},
        {name:'easy', max:100, color:'#d2de1d'},
        {name:'middle', max:140, color:'#debf21'},
        {name:'hard', max:200, color:'#de881e'},
        {name:'very hard', code:'very-hard', max:100000, color:'#de030d'}];

      this.$get = function () {
        return {
          availableAlgorithms: _algorithms,
          scores: _scores
        };
      };
    });
