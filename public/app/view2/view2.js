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
              $scope.classes = [];
              var found = false;
              data.forEach(function(cls){
                  found = false;
                  $scope.classes.forEach(function(thisCls){
                      if(cls._id === thisCls._id){
                          found = true;
                      }
                  });
                  if(found === false){
                      $scope.classes.push(cls);
                  }
              });
              console.log($scope.classes);
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
                .success(function (semesters, status, headers, config) {
                    $http({
                        method: 'GET',
                        url: '/periods/student/'+ $location.path().split("/")[2]
                    })
                        .success(function (periods, status, headers, config) {
                            $scope.semesters = [];
                            var found = false;
                            semesters.forEach(function(sem){
                                found = false;
                                $scope.semesters.forEach(function(thisSem){
                                    if(sem._id === thisSem._id){
                                        found = true;
                                    }
                                });
                                if(found === false){
                                    sem.periods = [];
                                    sem.periodIds.forEach(function(perId){
                                       periods.forEach(function(per){
                                           if(perId.pid === per._id){
                                               $http({
                                                   method: 'GET',
                                                   url: '/tasks/period/student/'+per._id+'/'+$scope.student._id
                                               })
                                                   .success(function (data, status, headers, config) {
                                                       per.tasks = [];
                                                       for(var i=0; i<data.length; i++){
                                                           $scope.student.doneTasks.forEach(function(task){
                                                               if(task.taskId == data[i]._id){
                                                                   data[i].achievedPointsForTask = task.achievedPoints;
                                                                   per.tasks.push(data[i]);
                                                               }
                                                           })
                                                       }
                                                       sem.periods.push(per);
                                                   }).
                                                   error(function (data, status, headers, config) {
                                                       $scope.error = data;
                                                   });
                                           }
                                       })
                                    });
                                    $scope.semesters.push(sem);
                                }
                            });
                        }).
                        error(function (data, status, headers, config) {
                            $scope.error = data;
                        });
                }).
                error(function (data, status, headers, config) {
                  $scope.error = data;
                });
          }).
          error(function (data, status, headers, config) {
            $scope.error = data;
          });

      $scope.getPointsForPeriod = function(period){
        var max = 0;
        var achieved = 0;
        period.tasks.forEach(function(task){
          max = max + task.maxPoints;
          achieved = achieved + task.achievedPointsForTask;
          });
        return {
            maximumPointsForPeriod: max,
            achievedPointsForPeriod: achieved
        }
      };

      $scope.getPointsForSemester = function(semester){
          var max = 0;
          var achieved = 0;
          var req = 0;
          semester.periods.forEach(function(period){
              max = max + $scope.getPointsForPeriod(period).maximumPointsForPeriod;
              achieved = achieved + $scope.getPointsForPeriod(period).achievedPointsForPeriod;
              req = req + period.reqPoints
          });
          return {
              maximumPointsForSemester: max,
              achievedPointsForSemester: achieved,
              requiredPointsForSemester: req
          }
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