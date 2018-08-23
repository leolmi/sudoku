'use strict';

angular.module('sudokuApp')
  .factory('sudokuBkgService', ['$rootScope',
    function($rootScope) {

      const default_name = 'my-table.jpg';
      const _state = {
        default: default_name,
        url: '',
        images: [default_name,'busy-day.jpg','night-city.jpg','norwegian-wood.jpg','vinyl.jpg','wild-flowers-dark.jpg']
      };

      function _url(name) {
        return 'url(\'../assets/images/' + name + '\')';
      }

      function set(name) {
        if (_.isNumber(name)) name = _state.images[name];
        name = name || default_name;
        _state.url = _url(name);
      }

      set(default_name);

      $rootScope.$on('$stateChangeSuccess', function (e, state) {
        set(((state||{}).data||{}).image);
      });

      return {
        state: _state,
        set: set
      }
    }]);
