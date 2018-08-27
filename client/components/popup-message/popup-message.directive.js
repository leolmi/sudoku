'use strict';

angular.module('sudokuApp')
  .factory('popupService', ['$q',
    function($q) {
      const _state = {
        active: false,
        title: '',
        text: '',
        buttons:[]
      };

      const _popup = {
        promise: null,
        resolve: null,
        reject: null
      };

      function hide() {
        _state.active = false;
        _state.title = '';
        _state.text = '';
        _state.buttons.splice(0);
        _popup.promise = null;
        _popup.resolve = null;
        _popup.reject = null;
      }

      function _button(opt, res) {
        if (_.isString(opt)) {
          opt = {
            caption: opt,
            style: res ? 'btn-primary' : 'btn-warning'
          }
        }
        const btn = _.clone(opt);
        btn.style = btn.style || 'btn-primary';
        btn.click =  function (e) {
          const cb = res ? _popup.resolve : _popup.reject;
          opt._event = e;
          if (_.isFunction(cb)) cb(opt);
        };
        return btn;
      }

      function _loadButtons(o) {
        _state.buttons = o.buttons||[];
        if (o.ok) _state.buttons.push(_button(o.ok, true));
        if (o.cancel) _state.buttons.push(_button(o.cancel, false));
        if (_state.buttons.length <= 0) _state.buttons.push('ok', false);
      }

      function _exit_back(cb) {
        return function (b) {
          hide();
          cb(b);
        }
      }

      function show(o) {
        if (!!_popup.promise) return console.warn('Popup is just opened!');
        o = o || {};
        if (!o.title&&!o.text) return console.error('Undefined popup!');
        _state.text = o.text;
        _state.title = o.title;
        _loadButtons(o);
        _popup.promise = $q(function(resolve, reject){
          _popup.resolve = _exit_back(resolve);
          _popup.reject = _exit_back(reject);
        });
        _state.active = true;
        return _popup.promise;
      }

      return {
        state: _state,
        hide: hide,
        show: show
      }
    }])
  .directive('popupMessage', ['popupService',
    function(popupService) {
      return {
        restrict: "E",
        templateUrl: 'components/popup-message/popup-message.html',
        scope: {},
        link: function (scope) {
          scope.state = popupService.state;
        }
      }
    }]);
