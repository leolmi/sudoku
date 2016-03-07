'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmIntersections',['Algorithm',
    function(Algorithm) {
      /**
       * Algoritmo di esclusione di valori su più gruppi:
       * se esistono valori, nell'intersezione di una riga o una colonna
       * con un quadrato, unici in uno dei gruppi,
       * questi valori vengono esclusi come possibilità per
       * le altre celle
       * @param info
       * @constructor
       */
      var AlgorithmIntersections = function(info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmIntersections.prototype = new Algorithm('intersections');

      AlgorithmIntersections.prototype.apply = function(schema, forks) {
        //allineamenti nel gruppo che permettono di escludere possibili valori su altri gruppi
        var self = this;
        var result = false;
        schema.groups.forEach(function (g) {
          if (g.type == 'D') {
            g.getAlignments().forEach(function (a) {
              schema.getGroups(a.cells).forEach(function (ga) {
                if (ga != g)
                  ga.cells.forEach(function (c) {
                    if (a.cells.indexOf(c) < 0) {
                      if (schema.checkValues(self, c, a.values)) result = true;
                    }
                  });
              });
            });
          }
        });
        return result;
      };

      return (AlgorithmIntersections);
    }]);
