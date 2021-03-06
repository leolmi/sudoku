'use strict';

angular.module('sudokuApp')
  .factory('Algorithm',[
    function() {
      var Algorithm = function(info) {
        this.score = 0;
        this.code = _.isString(info) ? info : '';
        this.active = true;
        if (_.isObject(info))
          _.extend(this, info);
      };
      Algorithm.prototype = {
        score: 0,
        code: '',
        active: true,
        apply: function(schema, forks) { return false; }
      };

      return (Algorithm);
    }]);
