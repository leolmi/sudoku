'use strict';

angular.module('sudokuApp')
  .factory('AlgorithmTry',['Algorithm',
    function(Algorithm) {
      /**
       *
       * @param info
       * @constructor
       */
      var AlgorithmTry = function (info) {
        if (info)
          _.extend(this, info);
      };

      AlgorithmTry.prototype = new Algorithm();

      AlgorithmTry.prototype.apply = function (schema, forks) {
        //1. ricerca la prima cella con elenco di valori possibili più piccolo
        var source = undefined;
        schema.cells.forEach(function (c, i) {
          if (!source || source.available.length > c.available.length)
            source = c;
        });
        var availables = source.available.slice(0);
        if (availables.length < 2) return false;
        var index = schema.cells.indexOf(source);

        //2. genera un numero di fork dato dal numero di valori possibili della cella -1 (lo schema origine)
        for (var i = 1; i < availables.length; i++)
          forks.push(schema.clone())

        //3. valorizza ogni schema, nella cella individuata, con il valore possibile scelto
        availables.forEach(function (v, i) {
          if (i==0)
            source.setValue(availables[i]);
          else
            forks[i-1].cells[index].setValue(availables[i]);
        });
        return true;
      };

      return (AlgorithmTry);
    }]);
