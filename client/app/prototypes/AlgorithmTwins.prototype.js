'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmTwins',['Algorithm',
    function(Algorithm) {
      /**
       *
       * @param info
       * @constructor
       */
      var AlgorithmTwins = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmTwins.prototype = new Algorithm();

      AlgorithmTwins.prototype.apply = function(schema, forks) {
        //ricerca i gemelli (le sole due celle che possono contenere una coppia di valori)
        return _.find(schema.groups, function(g) {
          //ricerca i summary con le coppie
          var summary = g.getSummary();

          var twins = _(summary)
            .filter(function(r){
              return r.code == 2;
            })
            .groupBy('hash')
            .filter(function(g){
              return g.length == 2;
            })
            .first()
            .value();

          if (twins) {
            //TODO: ....
          }
          return twins;

        });
      };

      return (AlgorithmTwins);
    }]);
