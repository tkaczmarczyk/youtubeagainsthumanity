angular.module('YAH', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        controller:'SerialTestController as serial',
        templateUrl:'_serial.html',
      })
      .when('/mirror', {
        controller:'MirrorTestController as mirror',
        templateUrl:'_mirror.html',
      })
      .when("/emo", {
        controller:'EmotionViewController as emo',
        templateUrl:'_emotionView.html',
      })
      .otherwise({
        redirectTo:'/'
      });
  });