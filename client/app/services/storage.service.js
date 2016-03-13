'use strict';

angular.module('sudokuApp')
  .factory('storage',['$q','$http',
    function($q, $http) {
      var _state = {
        loading: false
      };
      var _promise = null;

      function save(schema) {
      }



      function all() {
        if (!_promise) {
          _promise = $q(function (resolve, reject) {
            _state.loading = true;
            $http.get('/api/schema')
              .then(function(resp){
                _promise = null;
                _state.loading = false;
                resolve(resp.data);
              }, function(err){
                _promise = null;
                _state.loading = false;
                reject(err);
              });
          });
        }
        return _promise;
      }

      return {
        all:all,
        save:save
      }
    }]);
