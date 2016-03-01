'use strict';

angular.module('sudokuApp')
  .factory('Algorithm',[
    function() {
      var Algorithm = function(info) {
        this.name = '';
        this.score = 0;
        if (info)
          _.extend(this, info);
      };
      Algorithm.prototype = {
        name: '',
        score: 0,
        apply:function(schema) { return false; }
      };

      return (Algorithm);
    }]);
