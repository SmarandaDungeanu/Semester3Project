'use strict';

angular.module('myAppRename.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3/teacher/:teacherId', {
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
      .when('/view3/tasks/:periodId/:taskId', {
          templateUrl: 'app/view3/assignPoints.html',
          controller: 'PointsController'
      })
}])
    .controller('View3Ctrl', function ($scope, $http, $location) {

        $scope.getSemestersOfClass = function(cls){
            $scope.showDropdown = false;
            $scope.showSemForm = false;
            $scope.showPerForm = false;
            $scope.showClsForm = false;
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
        var teacherId = $location.path().split("/")[3];
        $scope.getAllClasses = function(){
            $http({
                method: 'GET',
                url: "/classes/teacher/"+ teacherId
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
            $scope.showDropdown = false;
            $scope.saveSemester = function(){
                $http({
                    method: 'POST',
                    url: '/semester/'+$scope.currentClassId+'/'+$scope.newSem.name+'/'+$scope.newSem.maxPoints+'/'+$scope.newSem.reqPoints
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
            $scope.showDropdown = false;
            $scope.currentSemesterName = semester.name;
            $scope.addPeriodForSemester = function(){
                $http({
                    method: 'POST',
                    url: '/period/'+semester._id+'/'+$scope.newPer.name
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
            $scope.showDropdown = false;
            $scope.saveClass = function(){
                $http({
                    method: 'POST',
                    url: '/class/'+$scope.newCls.name+'/'+teacherId
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

        $scope.openTeacherDropdown = function(){
            $scope.showDropdown = true;
            $scope.showSemForm = false;
            $scope.showPerForm = false;
            $scope.showClsForm = false;
            $scope.newTeacher = {};
            $http({
                method: 'GET',
                url: '/teachers'
            })
                .success(function (data, status, headers, config) {
                    $scope.allTeachers = [];
                    var found = false;
                    data.forEach(function(dropdownTeacher){
                        found = false;
                        dropdownTeacher.classIds.forEach(function(classId){
                            if(classId.cid === $scope.currentClassId){
                                found = true;
                            }
                        });
                        if(found === false){
                            $scope.allTeachers.push(dropdownTeacher);
                        }
                    });
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

        $scope.addExistingTeacherForClass = function(){
            $http({
                method: 'PUT',
                url: '/add/teacher/'+ $scope.currentClassId + '/' + $scope.newTeacher._id
            }).
                success(function (data, status, headers, config) {
                    console.log(data.fName+" assigned to class "+ $scope.currentClassId)
                })
                .error(function (data, status, headers, config) {
                    $scope.error = data;
                });
            $scope.newTeacher = {};
        };


        $scope.cancel = function(){
            $scope.showSemForm = false;
            $scope.showPerForm = false;
            $scope.showClsForm = false;
            $scope.showDropdown = false;
        };


        $scope.showSemForm = false;
        $scope.showPerForm = false;
        $scope.showClsForm = false;
        $scope.clicked = false;
        $scope.showDropdown = false;

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
                        //assign the new task to all the students in this period
                        $http({
                            method: 'PUT',
                            url: '/tasks/'+$scope.currentPeriodId+'/'+data._id
                        }).
                            success(function (data, status, headers, config) {
                                console.log("task added and assigned")
                            })
                            .error(function (data, status, headers, config) {
                                $scope.error = data;
                            });
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
            $scope.newStudent = {};
        };

        $scope.showStudentForm = false;

        $scope.createNewStudent = function(){
            $scope.showStudentForm = true;
            $scope.showDropDown = false;
            $scope.showNewStud = true;
            $scope.addStudentForPeriod = function(){
                $http({
                    method: 'POST',
                    url: '/student/' + $scope.currentPeriodId + '/' + $scope.newStudent.fName + '/' + $scope.newStudent.lName + '/' + $scope.newStudent.email + '/' + $scope.newStudent.username + '/' + $scope.newStudent.password
                }).
                    success(function (data, status, headers, config) {
                        $http({
                            method: 'PUT',
                            url: '/students/'+$scope.currentPeriodId+'/'+data._id
                        }).
                            success(function (data, status, headers, config) {

                            })
                            .error(function (data, status, headers, config) {
                                $scope.error = data;
                            });
                        $scope.students.push(data);
                    })
                    .error(function (data, status, headers, config) {
                        $scope.error = data;
                    });
                $scope.newStudent = {};
            }
        };

    $scope.openStudentsDropdown = function(){
      $scope.showDropDown = true;
      $scope.showNewStud = false;
      $scope.newStudent = {};
        $http({
            method: 'GET',
            url: '/students'
        })
            .success(function (data, status, headers, config) {
                $scope.allStudents = [];
                var found = false;
                data.forEach(function(dropdownStudent){
                    found = false;
                    $scope.students.forEach(function(student){
                        if(dropdownStudent._id === student._id){
                            found = true;
                        }
                    });
                    if(found===false){
                        $scope.allStudents.push(dropdownStudent);
                    }
                });
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
    $scope.addExistingStudentForPeriod = function(){
            $http({
                method: 'PUT',
                url: '/add/'+ $scope.currentPeriodId + '/' + $scope.newStudent._id
            }).
                success(function (data, status, headers, config) {
                    $http({
                        method: 'PUT',
                        url: '/students/'+$scope.currentPeriodId+'/'+data._id
                    }).
                        success(function (data, status, headers, config) {
                            $scope.students.push(data);
                        })
                        .error(function (data, status, headers, config) {
                            $scope.error = data;
                        });
                })
                .error(function (data, status, headers, config) {
                    $scope.error = data;
                });
        $scope.newStudent = {};
    }
    })
.controller('PointsController', function($scope, $http, $location){
        $http({
            method: 'GET',
            url: '/students/period/'+ $location.path().split("/")[3]
        }).
            success(function (data, status, headers, config) {
                $scope.students = data;
                $scope.currentPeriodId = $location.path().split("/")[3];

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

            }).
            error(function (data, status, headers, config) {
                $scope.error = data;
            });
        $http({
            method: 'GET',
            url: '/tasks/'+ $location.path().split("/")[4]
        }).
            success(function (data, status, headers, config) {
                $scope.currentTask = data;
            }).
            error(function (data, status, headers, config) {
                $scope.error = data;
            });
        $scope.savePointsForAll = function(){
            $scope.students.forEach(function(student){
                $http({
                    method: 'PUT',
                    url: '/student/'+student._id+'/'+$scope.currentTask._id+'/'+student.newPoints
                })
                    .success(function (data, status, headers, config) {
                        $scope.feedback = "Points registered!"
                    }).
                    error(function (data,         status, headers, config) {
                        $scope.feedback = data;
                    });
            })
        }
    });
