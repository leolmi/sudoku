'use strict';

angular.module('sudokuApp')
  .directive('sudokuNavBar', ['$location', 'Auth', '$state',
    function($location, Auth, $state) {
      return {
        restrict: "E",
        templateUrl: 'components/navbar/navbar.html',
        scope: {},
        link: function (scope) {
          function _openPage(name) {
            return function(e) {
              $state.go(name);
            }
          }

          scope.buttons = [{
            icon:'fa-th',
            click: _openPage('editor')
          },{
            icon:'fa-cogs',
            click: _openPage('engine')
          },{
            icon:'fa-user',
            click: _openPage('settings')
          },{
            icon:'fa-bug',
            click: _openPage('test')
          }];

          scope.isCollapsed = false;
          scope.isLoggedIn = Auth.isLoggedIn;
          scope.isAdmin = Auth.isAdmin;
          scope.getCurrentUser = Auth.getCurrentUser;

          scope.logout = function () {
            Auth.logout();
            $location.path('/login');
          };

          scope.isActive = function (route) {
            return route === $location.path();
          };
        }
      }
    }]);
