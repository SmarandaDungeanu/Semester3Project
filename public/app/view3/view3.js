'use strict';

angular.module('myAppRename.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'app/view3/view3.html',
    controller: 'View3Ctrl'
  })
      .when('/view3/:periodId', {
        templateUrl: 'app/view3/tasks.html',
        controller: 'TasksCtrl'
      })
      .when('/view3/students/:periodId', {
          templateUrl: 'app/view3/students.html',
          controller: 'StudentCtrl'
      })
}])
    .controller('View3Ctrl', function ($scope, $http) {

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

    })
    .controller('TasksCtrl', function($scope, $http, $location){
        $http({
            method: 'GET',
            url: 'tasks/period/'+ $location.path().split("/")[2]
        }).
            success(function (data, status, headers, config){
                $scope.tasks = data;
                $scope.currentPeriodId = $location.path().split("/")[2];
            })
            .error(function (data, status, headers, config) {
                $scope.error = data;
            });
        $scope.createNewTask = function() {
            $scope.showTaskForm = true;
            $scope.getCurrentPeriodName();
            $scope.addTaskForPeriod = function () {
                $http({
                    method: 'POST',
                    url: '/task/' + $scope.currentPeriodId + '/' + $scope.newTask.name + '/' + $scope.newTask.description + '/' + $scope.newTask.maxPoints
                }).
                    success(function (data, status, headers, config) {
                        $scope.tasks.push(data);
                    })
                    .error(function (data, status, headers, config) {
                        $scope.error = data;
                    });
                $scope.newTask = {};
            };
        };

        $scope.getCurrentPeriodName = function(){
            $http({
                method: 'GET',
                url: 'periods/'+$scope.currentPeriodId
            }).
                success(function (data, status, headers, config){
                    $scope.currentPeriodName = data.name;
                })
                .error(function (data, status, headers, config) {
                    $scope.error = data;
                });
        };

        $scope.cancel = function(){
            $scope.showTaskForm = false;
        };

        $scope.showTaskForm = false;
    })
       .controller('StudentCtrl', function($scope, $http, $location){
            $http({
                method: 'GET',
                url: '/students/period/'+ $location.path().split("/")[3]
            }).
                success(function (data, status, headers, config) {
                    $scope.students = data;
                    $scope.currentPeriodId = $location.path().split("/")[3];
                }).
                error(function (data, status, headers, config) {
                    $scope.error = data;
                });
        $scope.cancel = function(){
            $scope.showStudentForm = false;
        };

        $scope.showStudentkForm = false;

        $scope.createNewStudent = function(){
            $scope.showStudentForm = true;
            $scope.addStudentForPeriod = function(){
                $http({
                    method: 'POST',
                    url: '/student/' + $scope.currentPeriodId + '/' + $scope.newStudent.fName + '/' + $scope.newStudent.lName + '/' + $scope.newStudent.email + '/' + $scope.newStudent.username
                }).
                    success(function (data, status, headers, config) {
                        $scope.students.push(data);
                    })
                    .error(function (data, status, headers, config) {
                        $scope.error = data;
                    });
                $scope.newStudent = {};
            }
        }
    });
