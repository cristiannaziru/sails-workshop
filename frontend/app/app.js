var app = angular.module('workshop', ['ngRoute']);
app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl : '/components/home/home.tmpl.html',
    controller  : 'HomeCtrl'
  })
  .when('/login', {
      templateUrl : '/components/login/login.tmpl.html',
      controller : 'LoginCtrl'
  })
  .otherwise({redirectTo: '/'});
});