'use strict';

angular.module('sudokuApp')
  .factory('SolverOptions',[
    function() {
      var SolverOptions = function(info) {
        this.maxSchemas = 200;
        if (info)
          _.extend(this, info);
      };
      SolverOptions.prototype = {
        maxSchemas: 200
      };
      return (SolverOptions);
    }]);
