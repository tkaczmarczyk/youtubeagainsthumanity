angular.module('YAH', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        controller:'IntroController as intro',
        templateUrl:'_intro.html',
      })
      .when('/mirror', {
        controller:'MirrorTestController as mirror',
        templateUrl:'_mirror.html',
      })
      .otherwise({
        redirectTo:'/'
      });
  });