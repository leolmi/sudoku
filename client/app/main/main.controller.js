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
      $scope.schema = new SudokuSchema('600092000100300400008004050080600040009170000000040905090000300850036000000001092');

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
        manager.solve($scope.schema, true);
      };

      $rootScope.$on('selected-cell-changed', function(e, current){
        $scope.current = JSON.stringify(current, null, 2);
      });

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
