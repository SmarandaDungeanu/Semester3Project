'use strict';

angular.module('myAppRename.view5', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view5', {
            templateUrl: 'app/view5/view5.html',
            controller: 'View5Ctrl'
        })
    }])
    .controller('View5Ctrl', ['$scope', '$http', function ($scope, $http) {
        $http({
            method: 'GET',
            url: '/teachers'
        })
            .success(function (data, status, headers, config) {
                $scope.teachers = data;
                $scope.error = null;
            }).
            error(function (data, status, headers, config) {
                if (status == 401) {
                    $scope.error = "You are not authenticated to request these data";
                    return;
                }
                $scope.error = data;
            });
        $scope.showNewTeacher = false;
        $scope.createNewTeacher = function(){
            $scope.showNewTeacher = true;
            $scope.addTeacher = function(){
                $http({
                    method: 'POST',
                    url: '/teacher/' + $scope.newTeacher.fName + '/' + $scope.newTeacher.lName + '/' + $scope.newTeacher.email + '/' + $scope.newTeacher.username + '/' + $scope.newTeacher.password
                }).
                    success(function (data, status, headers, config) {
                        $scope.teachers.push(data);
                    })
                    .error(function (data, status, headers, config) {
                        $scope.error = data;
                    });
                $scope.newTeacher = {};
            }
        };

        $scope.cancel = function(){
            $scope.showNewTeacher = false;
        }

    }]);