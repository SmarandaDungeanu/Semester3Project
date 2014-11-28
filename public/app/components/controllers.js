angular.module('myAppRename.controllers', [ 'ui.bootstrap']).
  controller('AppCtrl', function ($scope, $http, $window,$location) {

    function url_base64_decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
        case 0:
          break;
        case 2:
          output += '==';
          break;
        case 3:
          output += '=';
          break;
        default:
          throw 'Illegal base64url string!';
      }
      return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
    }


    $scope.title = "Semester Project";
    $scope.username = "";
    $scope.isAuthenticated = false;
    $scope.isAdmin = false;
    $scope.isUser = false;
    $scope.message = '';
    $scope.error = null;

    $scope.submit = function () {
      $http
        .post('/authenticate', $scope.user)
        .success(function (data, status, headers, config) {
          $window.sessionStorage.token = data.token;
          $scope.isAuthenticated = true;
          var encodedProfile = data.token.split('.')[1];
          var profile = JSON.parse(url_base64_decode(encodedProfile));
          $scope.username = profile.username;
          $scope.isAdmin = profile.role == "admin";
          $scope.isUser = !$scope.isAdmin;
          $scope.error = null;
        })
        .error(function (data, status, headers, config) {
          // Erase the token if the user fails to log in
          delete $window.sessionStorage.token;
          $scope.isAuthenticated = false;

          $scope.error = 'You failed to login. Invalid User or Password';
        });
    };

    $scope.logout = function () {
      $scope.isAuthenticated = false;
      $scope.isAdmin =false;
      $scope.isUser = false;
      delete $window.sessionStorage.token;
      $location.path("/view1");
    }
  })

  .controller('MyCtrl2', function ($scope) {
    // write MyCtrl2 here
  })
    .controller('View3Ctrl', function ($scope, $http) {


        //$http({
        //  method: 'GET',
        //  url: '/semesters'
        //}).
        //    success(function (data, status, headers, config) {
        //      $scope.semesters = data;
        //      $scope.error = null;
        //    }).
        //    error(function (data, status, headers, config) {
        //      if (status == 401) {
        //        $scope.error = "You are not authenticated to request these data";
        //        return;
        //      }
        //      $scope.error = data;
        //    });


      $scope.getSemestersOfClass = function(cls){
        $http({
          method: 'GET',
          url: '/semesters/class/'+cls._id
        }).
            success(function (data, status, headers, config) {
              $scope.currentClassId = cls._id;
              $scope.currentClassName = cls.name;
              $scope.semesters = data;
              $scope.error = null;
              $scope.clicked = true;
            }).
            error(function (data, status, headers, config) {
              if (status == 401) {
                $scope.error = "You are not authenticated to request these data";
                return;
              }
              $scope.error = data;
            });
      };

      $scope.getAllClasses = function(){
        $http({
          method: 'GET',
          url: '/classes'
        }).
            success(function (data, status, headers, config) {
              $scope.classes = data;
              $scope.error = null;
            }).
            error(function (data, status, headers, config) {
              if (status == 401) {
                $scope.error = "You are not authenticated to request these data";
                return;
              }
              $scope.error = data;
            });
      };

      $scope.getPeriodsOfSemester = function(semester){
        $http({
          method: 'GET',
          url: '/periods/semester/'+semester._id
        }).
            success(function (data, status, headers, config){
              $scope.currentPeriods = data;
              $scope
            })
            .error(function (data, status, headers, config) {
              $scope.error = data;
            });
      };
      $scope.createNewSemester = function(){
        $scope.showSemForm = true;
        $scope.showPerForm = false;
        $scope.showClsForm = false;

          $scope.saveSemester = function(){
            $http({
              method: 'POST',
              url: '/semester/'+$scope.currentClassId+'/'+$scope.newSem.name+'/'+$scope.newSem.startingDate+'/'+$scope.newSem.endingDate
            }).
                success(function (data, status, headers, config){
                  $scope.semesters.push(data);
                })
                .error(function (data, status, headers, config) {
                  $scope.error = data;
                });
            $scope.newSem = {};
          };
      };

      $scope.createNewPeriod = function(semester){
        $scope.showSemForm = false;
        $scope.showPerForm = true;
        $scope.showClsForm = false;
        $scope.currentSemesterName = semester.name;
        $scope.addPeriodForSemester = function(){
          $http({
            method: 'POST',
            url: '/period/'+semester._id+'/'+$scope.newPer.name+'/'+$scope.newPer.maxPoints+'/'+$scope.newPer.reqPoints
          }).
              success(function (data, status, headers, config){

                $scope.currentPeriods.push(data);
              })
              .error(function (data, status, headers, config) {
                $scope.error = data;
              });
          $scope.newPer = {};
        }
      };

      $scope.createNewClass = function(){
        $scope.showSemForm = false;
        $scope.showPerForm = false;
        $scope.showClsForm = true;
        $scope.saveClass = function(){
          $http({
            method: 'POST',
            url: '/class/'+$scope.newCls.name
          }).
              success(function (data, status, headers, config){
              //  $scope.classes.push(data);
              })
              .error(function (data, status, headers, config) {
                $scope.error = data;
              });
          $scope.newCls = {};
        };
      };


      $scope.cancel = function(){
        $scope.showSemForm = false;
        $scope.showPerForm = false;
        $scope.showClsForm = false;
      };


      $scope.showSemForm = false;
      $scope.showPerForm = false;
      $scope.showClsForm = false;
      $scope.clicked = false;

    });



