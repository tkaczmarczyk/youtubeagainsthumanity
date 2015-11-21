 angular.module('YAH')
  .controller('PlayersController', function(GlobalContext) {
   var context = this;
   context.playersCount = 1;
   context.players = [];
   context.new_name = "New name";
   context.new_gender = 0;
   
   context.GC = GlobalContext;
   GlobalContext.players = context.players;
   
   context.addPlayer = function() {
    // var name = window.prompt("Player name?", "");
    // if (name == null) {
    //  return;
    // }

    context.players.push({
     // id: context.players.length,
     name: context.new_name,
     gender: context.new_gender

    });

    //$("#players").append("<div class='player'><span class='name'>"+name+"</span></div>");

   }

   context.removePlayer = function(name) {
    for (var i = context.players.length; i--; ) {
     if(context.players[i].name == name){
      context.players.splice(i, 1);
     }
    }
   }

   context.save = function() {

   }


   angular.element(document).ready(function() {
    // $("#new_player_gender img").click(function(){
    //  $("#new_player_gender img").removeClass("active");
    //  $(this).addClass("active");
    // })
   });

  });