'use strict';

angular.module('sudokuApp')
  .factory('Algorithm',[
    function() {
      var Algorithm = function(info) {
        this.name = '';
        this.score = 0;
        this.code = _.isString(info) ? info : '';
        if (_.isObject(info))
          _.extend(this, info);
      };
      Algorithm.prototype = {
        name: '',
        score: 0,
        code: '',
        apply:function(schema, forks) { return false; }
      };

      return (Algorithm);
    }]);
