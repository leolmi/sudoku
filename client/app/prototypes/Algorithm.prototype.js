'use strict';

angular.module('sudokuApp')
  .factory('Algorithm',[
    function() {
      var Algorithm = function(info) {
        if (info)
          _.extend(this, info);
      };
      Algorithm.prototype = {
        name: '',
        apply:function(schema) { return false; }
      };

      return (Algorithm);
    }])
  .factory('AlgorithmSingleValue',['Algorithm',
    function(Algorithm) {



      var AlgorithmSingleValue = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmSingleValue.prototype = new Algorithm();

      AlgorithmSingleValue.prototype.apply = function(schema) {
        //TODO: ...
        return false;
      };

      return (AlgorithmSingleValue);
    }])
  .factory('AlgorithmSingleCell',['Algorithm',
    function(Algorithm) {
      var AlgorithmSingleCell = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmSingleCell.prototype = new Algorithm();

      AlgorithmSingleCell.prototype.apply = function(schema) {
        //TODO: ...
        return false;
      };

      return (AlgorithmSingleCell);
    }]);
