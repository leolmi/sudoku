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
    }]);
