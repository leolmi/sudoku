'use strict';

angular.module('sudokuApp')
  .controller('MainCtrl', ['$scope','$http','socket','$rootScope', 'SudokuSchema','manager','util',
    function ($scope, $http, socket, $rootScope, SudokuSchema, manager, util) {

      $scope.buttons = [{
        icon:'fa-th',
        page:'schema'
      },{
        icon:'fa-cogs',
        page:'engine'
      },{
        icon:'fa-user',
        page:'settings'
      }];
      $scope.activePage = $scope.buttons[0].page;
      //$scope.schema = new SudokuSchema('000002000040500700516000240000026000890000072000840000069000183003007020000100000'); //facile (55)
      //$scope.schema = new SudokuSchema('005030170073016000400900000300000060004000900020000003000009002000650390037020500'); //difficile (112)
      //$scope.schema = new SudokuSchema('000070008007200003630850090060000005200643001900000060050068012100002700700030000'); //medio (86)
      //$scope.schema = new SudokuSchema('000000000000096020007080035201068700003000500009450103830040200040910000000000000'); //facile ()
      $scope.schema = new SudokuSchema('000080000049600010002010409306700020000000000020008304601020700090001250000070000'); //? ()

      var _last = null;
      function resetSelection(line) {
        if (_last) delete _last.highlight;
        $scope.line = ($scope.line == line) ? undefined : line;
        _last = $scope.line ? $scope.schema.cells[$scope.line.index] : null;
        if (_last) _last.highlight = true;
      }

      $scope.setPage = function(page) {
        $('.tab-pane.active').removeClass('active');
        $('#'+ page).addClass('active');
        $scope.activePage = page;
      };

      $scope.save = function() {
        //TODO...
      };

      $scope.open = function() {
        //TODO...
      };

      $scope.managerState = manager.state;
      $scope.best = false;

      $scope.solve = function() {
        manager.solveStep($scope.schema);
        resetSelection();
      };

      $scope.solveAll = function() {
        var result = manager.solveAll($scope.schema, $scope.best);
        if (result && result.length > 0)
          $scope.schema.cloneBy(result[0]);
        if (result && result.length > 1)
          alert('Lo schema non è a soluzione unica!! (trovate ' + result.length + ' soluzioni)');
        resetSelection();
      };

      $scope.reset = function() {
        $scope.schema.reset();
        resetSelection();
      };




      $scope.select = function(line) {
        resetSelection(line);
      };

      $scope.getDiff = function() {
        var score = parseInt($scope.schema.getScore()) || 0;
        var sc = _.find(util.constants.scores, function(s){
          return s.max > score;
        });
        return sc.name;
      };

      $scope.getCell = function(line) {
        var x = (line.index % $scope.schema.dimension) + 1;
        var y = parseInt(line.index / $scope.schema.dimension) + 1;
        return '[' + x + ',' + y + ']';
      };

      $rootScope.$on('selected-cell-changed', function(e, current){
        $scope.current = JSON.stringify(current, null, 2);
      });

      $scope.schemaButtons = [{
        style:'fa-star-half-o',
        tooltip: 'Risolvi passo',
        action: $scope.solve
      },{
        style:'fa-star',
        tooltip: 'Risolvi tutto',
        action: $scope.solveAll
      },{
        style:'fa-undo',
        tooltip: 'Resetta Schema',
        action: $scope.reset
      }];


      //$scope.awesomeThings = [];
      //
      //$http.get('/api/things').success(function(awesomeThings) {
      //  $scope.awesomeThings = awesomeThings;
      //  socket.syncUpdates('thing', $scope.awesomeThings);
      //});
      //
      //$scope.addThing = function() {
      //  if($scope.newThing === '') {
      //    return;
      //  }
      //  $http.post('/api/things', { name: $scope.newThing });
      //  $scope.newThing = '';
      //};
      //
      //$scope.deleteThing = function(thing) {
      //  $http.delete('/api/things/' + thing._id);
      //};
      //
      //$scope.$on('$destroy', function () {
      //  socket.unsyncUpdates('thing');
      //});
    }]);
