'use strict';

angular.module('myAppRename.view4', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view4', {
    templateUrl: 'app/view4/view4.html',
    controller: 'View4Ctrl'
  });
}])

.controller('View4Ctrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $http({
            method: 'GET',
            url: '/students/'+ $scope.userId
        })
            .success(function (data, status, headers, config) {
                $scope.student = data;
                $http({
                    method: 'GET',
                    url: '/semesters/student/'+ $scope.userId
                })
                    .success(function (semesters, status, headers, config) {
                        $http({
                            method: 'GET',
                            url: '/periods/student/'+ $scope.userId
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
            var achieved = 0;
            semester.periods.forEach(function(period){
                achieved = achieved + $scope.getPointsForPeriod(period).achievedPointsForPeriod;
            });
            return {
                achievedPointsForSemester: achieved
            }
        };
    }]);