angular.module('YAH', ['ngRoute', 'ngAudio'])
  .config(function($routeProvider) {
    var socket = io.connect();


    var GlobalContext = {
      currentRound: {
        movieUrl: "https://www.youtube.com/watch?v=nHc288IPFzk",
        score: 0,
        mostRecentHappinessLevel: 0
      },
      gameNumber: 0,
      players: [{
        name: "Me",
        gender: 0
      }, {
        name: "Waiting...",
        gender: 0
      }],
      pairConnected: false,
      movieOutReady: false,
      movieInReady: false,
      outgoingMovie: "",
      roundsPerPlayer: 1,
      threshold: 0.4,
      emotionCheckInterval: 500,
      locationProvider: null, //filled in a controller. Hack
      scopeProvider: null //filled in a controller. Hack
    };

    GlobalContext.getCurrentPlayer = function() {
      return GlobalContext.players[GlobalContext.gameNumber % GlobalContext.players.length];
    };
    GlobalContext.checkThreshold = function() {
      if (GlobalContext.currentRound.mostRecentHappinessLevel > GlobalContext.threshold) {
        //Start shooting
        //3 seconds interval
        var t = (GlobalContext.currentRound.mostRecentHappinessLevel - GlobalContext.threshold) / (1 - GlobalContext.threshold);
        var bulletIntervalForMin = 1000;
        var bulletIntervalForMax = 500;
        var bulletInterval = bulletIntervalForMin + t * (bulletIntervalForMax - bulletIntervalForMin);

        socket.emit('triggerShot');
        var triggerTimer = setInterval(function() {
          console.log("Shoot");
          socket.emit('triggerShot');
        }, bulletInterval);

        setTimeout(function() {
          clearInterval(triggerTimer);
        }, GlobalContext.emotionCheckInterval);

        //Add points
        GlobalContext.currentRound.score += GlobalContext.currentRound.mostRecentHappinessLevel * 5;
      }
    };
    GlobalContext.initNewGame = function() {
      GlobalContext.gameNumber = 0;
      for (var i = 0; i < GlobalContext.players.length; i++) {
        GlobalContext.players[i].score = 0;
      }
    };

    GlobalContext.sendIdentify = function() {
      socket.emit('identify', GlobalContext.players[0].name, GlobalContext.players[0].gender);
    };

    GlobalContext.selectMovie = function(url) {
      GlobalContext.movieOutReady = true;
      socket.emit('selectMovie', url);
    };

    GlobalContext.registerScore = function(score) {
      GlobalContext.outMovieReady = false;
      socket.emit('registerScore', score);
    };

    var resolveGlobalContext = {
      GlobalContext: function() {
        return GlobalContext;
      }
    };


    socket.on('pairIdentified', function(player) {
      GlobalContext.scopeProvider.$apply(function() {
        GlobalContext.pairConnected = true;
        GlobalContext.players[1].name = player.name;
        GlobalContext.players[1].gender = player.gender;
      });
    });

    socket.on('movieSelected', function(url) {
      GlobalContext.scopeProvider.$apply(function() {
        GlobalContext.movieInReady = true;
        GlobalContext.currentRound.movieUrl = url;
      });
    });

    socket.on('scoreRegistered', function(score) {
      GlobalContext.scopeProvider.$apply(function() {
        GlobalContext.players[1].score += score;
      });
    })

    socket.on('pairDisconnected', function(player, $location) {
      // GlobalContext.locationProvider.path("/client");
      window.location.href = "/client";
    });

    GlobalContext.sendIdentify();

    $routeProvider
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
        controller: 'SerialTestController as serial',
        templateUrl: '_serial.html',
        resolve: resolveGlobalContext
      })
      .otherwise({
        redirectTo: '/players'
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

angular.module('YAH').directive('animateOnChange', function($timeout) {
  return function(scope, element, attr) {
    scope.$watch(attr.animateOnChange, function(nv, ov) {
      if (nv != ov) {
        if (element.hasClass("animated")) return;

        element.addClass(element.attr('data-anim'));
        element.addClass('animated');

        var removeAnimatedClass = function() {
          element.removeClass("animated");
          element.removeClass(element.attr('data-anim'));
          // element[0].removeEventListener('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeAnimatedClass);
        };
        element.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeAnimatedClass);
      }
    });
  };
});