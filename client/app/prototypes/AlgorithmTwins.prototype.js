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

      AlgorithmTwins.prototype.apply = function(schema) {
        //TODO ....
        return false;
      };

      return (AlgorithmTwins);
    }]);
