'use strict';

angular.module('sudokuApp')
  .controller('EditorCtrl', ['$scope','$http','sudokuService','popupService','util','$timeout',
    function ($scope,$http,sudokuService,popupService,util,$timeout) {
      $scope.state = {
        loading: false,
        report: false,
        solutions: false,
        error: null,
        schemas: [],
        // result: {},
        test: false
      };

      $scope.schemaOptions = {};
      $scope.schemaState = sudokuService.state;

      function _resetOptions() {
        $scope.state.report = false;
        $scope.state.solutions = false;
      }

      function _refreshList() {
        if ($scope.state.loading) return;
        $scope.state.loading = true;
        $scope.state.error = null;
        $http.get('api/schema')
          .then(function (resp) {
            $scope.state.schemas = resp.data;
            $scope.state.loading = false;
          }, function (err) {
            $scope.state.error = err;
            $scope.state.loading = false;
          });
      }

      function _buildSchema(data) {
        console.log('RECOGNIZE DATA', data);
        // TODO....
      }

      $scope.open = function(schema) {
        _resetOptions();
        sudokuService.open(schema);
      };

      $scope.toggleSolution = function(sol) {
        sudokuService.state.schema.keep(sol);
      };

      $scope.select = function(item) {
        sudokuService.select(item.x, item.y);
      };

      $scope.import = function() {
        popupService.show({
          input: true,
          ok: 'OK',
          cancel: 'Cancel',
          title: 'Import data',
          text: 'Insert data to import'
        }).then(function(o){
          _resetOptions();
          sudokuService.import(o.data);
        });
      };

      $scope.download = function() {
        const raw = util.sanitize(sudokuService.state.schema);
        const txt = JSON.stringify(raw, null, 2);
        util.saveFile(txt, (sudokuService.state.schema.name||'schema') + '.json');
      };

      $scope.print = function() {
        window.print();
      };

      $scope.save = function() {
        if (!sudokuService.state.schema.unique) return;
        const raw = util.sanitize(sudokuService.state.schema);
        delete raw._id;
        $http.post('api/schema', raw)
          .then(function () {
            popupService.toast('schema saved!', 'success');
            _refreshList();
          }, function (err) {
            popupService.toast(err, 'error');
          });
      };

      function _readFile(file, cb, method) {
        _resetOptions();
        method = method || 'readAsText';
        const r = new FileReader();
        r.onloadend = function (e) {
          util.safeApply($scope, () => cb(e.target.result));
        };
        r.onerror = function (err) {
          popupService.toast(err, 'error');
        };
        r[method](file);
      }

      function _recognizeFile(file) {
        if (/text|json/g.test(file.type)) {
          _readFile(file, function(txt) {
            if (util.isJson(txt)) {
              try {
                const json = JSON.parse(txt);
                sudokuService.open(json);
              } catch(err) {
                popupService.toast(err, 'error');
              }
            } else {
              sudokuService.state.schema.parse(txt)
            }
          });
        } else if (/image\/.*/g.test(file.type)) {
          popupService.toast('Not implemented yet!', 'warning');
          // _readFile(file, function(job){
          //   const data = {fileData:new Uint8Array(job.result), fileName:file.name};
          //   $http.post('api/schema/recognize', data)
          //     .then(function (resp) {
          //       _buildSchema(resp.data);
          //     }, function (err) {
          //       popupService.toast(err, 'error');
          //     });
          // }, 'readAsArrayBuffer')
        } else {
          popupService.toast('Unrecognize file or data!', 'error');
        }
      }


      $scope.recognize = function() {
        $timeout(function() { $('#input-recognize').trigger('click'); }, 0);
      };

      $scope.pencilize = function() {
        const cell = sudokuService.cell();
        if (cell) cell.pencilize();
      };

      $scope.setFile = function() {
        $scope.$apply(function() {
          const e = $('#input-recognize')[0];
          if ((e||{}).files.length>0) {
            _recognizeFile(e.files[0]);
          }
        });
      };

      $scope.test = function() {
        ///
      };

      $scope.toggle = function() {
        const schema = (sudokuService.state.schema||{});
        schema.pencil = !schema.pencil;
      };

      $scope.report = function() {
        $scope.state.report = !$scope.state.report;
      };

      $scope.solutions = function() {
        $scope.state.solutions = !$scope.state.solutions;
      };

      $scope.drawing = function() {
        sudokuService.toggle($scope);
      };

      $scope.solve = function() {
        sudokuService.solve($scope);
      };

      $scope.clear = function() {
        sudokuService.reset($scope);
      };

      $scope.$watch(function() { return sudokuService.state.schema }, function(s) {
        $scope.schema = s;
      });

      $scope.$watch(function() { return (sudokuService.state.schema||{}).name }, function(s) {
        document.title =  sudokuService.state.schema?sudokuService.state.schema.getTitle():'sdk';
      });

      _refreshList();
    }]);
