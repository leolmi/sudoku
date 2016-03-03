'use strict';

angular.module('sudokuApp')
  .controller('MainCtrl', ['$scope','$http','socket','$rootScope', 'SudokuSchema','manager',
    function ($scope, $http, socket, $rootScope, SudokuSchema, manager) {

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
      //$scope.schema = new SudokuSchema('000002000040500700516000240000026000890000072000840000069000183003007020000100000'); //medio
      //$scope.schema = new SudokuSchema('005030170073016000400900000300000060004000900020000003000009002000650390037020500'); //difficile
      $scope.schema = new SudokuSchema('000070008007200003630850090060000005200643001900000060050068012100002700700030000'); //medio

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

      $scope.solve = function() {
        manager.solveStep($scope.schema);
      };

      $scope.solveAll = function() {
        var result = manager.solveAll($scope.schema);
        if (result.length > 0)
          $scope.schema.cloneBy(result[0]);
        if (result.length > 1)
          alert('Lo schema non è a soluzione unica!! (trovate ' + result.length + ' soluzioni)');
      };

      $scope.reset = function() {
        $scope.schema.reset();
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
