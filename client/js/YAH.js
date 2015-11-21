angular.module('YAH', ['ngRoute'])
  .config(function($routeProvider) {
    var GlobalContext = {
      foo: "asd"
    };
    var resolveGlobalContext = {
      GlobalContext: function() {
        return GlobalContext;
      }
    };
    
    $routeProvider
      .when('/', {
        controller: 'IntroController as intro',
        templateUrl: '_intro.html',
        resolve: resolveGlobalContext
      })
      .when('/mirror', {
        controller: 'MirrorTestController as mirror',
        templateUrl: '_mirror.html',
        resolve: resolveGlobalContext
      })
      .when("/emo", {
        controller: 'EmotionViewController as emo',
        templateUrl: '_emotionView.html',
        resolve: resolveGlobalContext

      })
      .when("/players", {
        controller: 'PlayersController as players',
        templateUrl: '_playersView.html',
        resolve: resolveGlobalContext
      })
      .when("/enter_link", {
        controller: 'EnterLinkController as enter_link',
        templateUrl: '_enterLinkView.html',
        resolve: resolveGlobalContext
      })
      .otherwise({
        redirectTo: '/'
      });
  });