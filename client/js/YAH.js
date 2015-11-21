angular.module('YAH', ['ngRoute'])
  .config(function($routeProvider) {
    var GlobalContext = {
      currentRound: {
        movieUrl: "https://www.youtube.com/watch?v=nHc288IPFzk",
        score: 0,
        mostRecentHappinessLevel: 0
      },
      gameNumber: 0,
      players: [],
      roundsPerPlayer: 1,
      threshold: 0.3
    };
    GlobalContext.getCurrentPlayer = function() {
      return GlobalContext.players[GlobalContext.gameNumber % GlobalContext.players.length];
    };
    GlobalContext.checkThreshold = function() {
      if(GlobalContext.currentRound.mostRecentHappinessLevel > GlobalContext.threshold) {
        //Start shooting
        
        //Add points
        GlobalContext.currentRound.score += GlobalContext.currentRound.mostRecentHappinessLevel * 5; 
      }
    };
    GlobalContext.initNewGame = function() {
      GlobalContext.gameNumber = 0;
      for(var i=0; i < GlobalContext.players.length; i++) {
        GlobalContext.players[i].score = 0;
      }
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
      .when("/roundSummary", {
        controller: 'RoundSummaryController as round',
        templateUrl: '_roundSummary.html',
        resolve: resolveGlobalContext
      })
      .when("/gameSummary", {
        controller: 'GameSummaryController as game',
        templateUrl: '_gameSummary.html',
        resolve: resolveGlobalContext
      })
            .when("/serial", {
              controller:'SerialTestController as serial',
        templateUrl:'_serial.html',        resolve: resolveGlobalContext
      })
      .otherwise({
        redirectTo: '/'
      });
      


      //Keep video initialized
      //Keep video initialized
    angular.element(document).ready(function() {

      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

      var video = document.querySelector('video');


      var vgaConstraints = {
        video: {
          mandatory: {
            maxWidth: 640,
            maxHeight: 360
          }
        }
      };

      if (navigator.getUserMedia) {
        navigator.getUserMedia(vgaConstraints, function(stream) {
          video.src = window.URL.createObjectURL(stream);
        }, function() {
          console.log("ERRORERROR");
        });
      }
      else {
        // video.src = 'somevideo.webm'; // fallback.
      }

    });
  });
  
angular.module('YAH').config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
});