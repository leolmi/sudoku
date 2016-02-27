'use strict';

angular.module('sudokuApp')
  .controller('MainCtrl', ['$scope','$http','socket','SudokuSchema',
    function ($scope, $http, socket,SudokuSchema) {

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
      $scope.schema = new SudokuSchema();

      $scope.setPage = function(page) {
        $('.tab-pane.active').removeClass('active');
        $('#'+ page).addClass('active');
        $scope.activePage = page;
      };

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
