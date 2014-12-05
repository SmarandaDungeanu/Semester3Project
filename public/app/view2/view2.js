'use strict';

angular.module('myAppRename.view2', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view2', {
      templateUrl: 'app/view2/view2.html',
      controller: 'View2Ctrl'
    })
        .when('/view2/:studId', {
          templateUrl: 'app/view2/studentProfile.html',
          controller: 'ProfileController'
        })
  }])
  .controller('View2Ctrl', ['$scope', '$http', function ($scope, $http) {
    $http({
      method: 'GET',
      url: '/students'
    })
      .success(function (data, status, headers, config) {
        $scope.students = data;
        $scope.error = null;
      }).
      error(function (data, status, headers, config) {
        if (status == 401) {
          $scope.error = "You are not authenticated to request these data";
          return;
        }
        $scope.error = data;
      });
      $scope.getClassesForStudent = function(studId){
        $http({
          method: 'GET',
          url: '/classes/student/'+studId
        })
            .success(function (data, status, headers, config) {
              $scope.classes = data;
              $scope.error = null;
            }).
            error(function (data, status, headers, config) {
              $scope.error = data;
            });
      }
  }]).
    controller('ProfileController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
      $http({
        method: 'GET',
        url: '/students/'+ $location.path().split("/")[2]
      })
          .success(function (data, status, headers, config) {
            $scope.student = data;
            $http({
              method: 'GET',
              url: '/semesters/student/'+ $location.path().split("/")[2]
            })
                .success(function (data, status, headers, config) {
                  $scope.semesters = data;

                }).
                error(function (data, status, headers, config) {
                  $scope.error = data;
                });

          }).
          error(function (data, status, headers, config) {
            $scope.error = data;
          });

      $scope.getPeriods = function(){
        $http({
          method: 'GET',
          url: '/periods/student/'+ $location.path().split("/")[2]
        })
            .success(function (data, status, headers, config) {
              $scope.periods = data;
              $scope.maxPointsForPeriod = [];
              $scope.achievedPointsForPeriod =[];
            }).
            error(function (data, status, headers, config) {
              $scope.error = data;
            });
      };

      $scope.getTasks = function(perId){

        $http({
          method: 'GET',
          url: '/tasks/period/student/'+perId+'/'+$scope.student._id
        })
            .success(function (data, status, headers, config) {
              $scope.tasks = [];
              for(var i=0; i<data.length; i++){
                $scope.student.doneTasks.forEach(function(task){
                  if(task.taskId == data[i]._id){
                    data[i].achievedPointsForTask = task.achievedPoints;
                    $scope.tasks.push(data[i]);
                  }
                })
              }
            }).
            error(function (data, status, headers, config) {
              $scope.error = data;
            });
      };

      $scope.getPointsForPeriod = function(){
        var max = 0;
        var achieved = 0;
        $scope.tasks.forEach(function(task){
          max = max + task.maxPoints;
          achieved = achieved + task.achievedPointsForTask;
          });
        $scope.maxPointsForPeriod.push(max);
        $scope.achievedPointsForPeriod.push(achieved);
      };

      $scope.showAssignTasksForm = false;

      $scope.cancel = function(){
        $scope.showAssignTasksForm = false;
      };

      $scope.editAchievedPoints = function(task){
        $scope.showAssignTasksForm = true;
        $scope.newTask = task;
        $scope.savePoints = function(){
          $http({
            method: 'PUT',
            url: '/student/'+$scope.student._id+'/'+task._id+'/'+$scope.newTask.achievedPoints
          })
              .success(function (data, status, headers, config) {
                  $scope.newTask = {};
              }).
              error(function (data, status, headers, config) {
                $scope.error = data;
              });
        };
      };
      }]);