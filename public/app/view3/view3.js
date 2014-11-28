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
      });
}]);
