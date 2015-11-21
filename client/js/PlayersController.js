 angular.module('YAH')
  .controller('PlayersController', function(GlobalContext, ngAudio, $location, $scope) {
   GlobalContext.locationProvider = $location;
   GlobalContext.scopeProvider = $scope;

   var context = this;
   context.playersCount = GlobalContext.players.length;
   // context.new_name = "";
   // context.new_gender = 0;
   
   context.GC = GlobalContext;
   context.players = GlobalContext.players;

   GlobalContext.initNewGame();

   // context.addPlayer = function() {
   //  context.players.push({
   //   name: context.new_name,
   //   gender: context.new_gender,
   //   emotions: [],
   //   score: 0
   //  });
   // }

   context.removePlayer = function(name) {
    for (var i = context.players.length; i--; ) {
     if(context.players[i].name == name){
      context.players.splice(i, 1);
     }
    }
   }

   context.save = function() {

   }


  });