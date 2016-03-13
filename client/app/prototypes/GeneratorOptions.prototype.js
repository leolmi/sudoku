'use strict';

angular.module('sudokuApp')
  .factory('GeneratorOptions',[
    function() {
      var GeneratorOptions = function(info) {
        this.type = '9x9';
        this.fixedValues = 28;
        this.useCurrent = false;
        this.oneSchemaOnGeometry = true;
        this.uniqueSolution = true;
        this.symmetry = 'none';
        this.enhancementCycles = 100;
        this.difficulty = 'unknown';
        this.stop = {
          type: 'manual',
          number: 10
        };
        if (info)
          _.extend(this, info);
      };
      GeneratorOptions.prototype = {
        type: '9x9',
        fixedValues: 28,
        useCurrent: false,
        oneSchemaOnGeometry: true,
        uniqueSolution: true,
        symmetry: 'none',
        enhancementCycles: 100,
        difficulty: 'unknown',
        stop: {
          type: 'manual', //manual,schemas
          number: 10
        }
      };
      return (GeneratorOptions);
    }]);
