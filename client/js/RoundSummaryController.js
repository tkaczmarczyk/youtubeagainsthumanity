 angular.module('YAH')
    .controller('RoundSummaryController', function(GlobalContext, ngAudio) {
    var context = this;
    context.GC = GlobalContext;
    context.forWhom = GlobalContext.getCurrentPlayer();
         
    context.gameOver = false;
    context.scoreThisRound = GlobalContext.currentRound.score;
    context.player = GlobalContext.getCurrentPlayer();
    
    GlobalContext.getCurrentPlayer().score += GlobalContext.currentRound.score;
    
    var sc = GlobalContext.currentRound.score;
    
    GlobalContext.currentRound.score = 0;
    GlobalContext.currentRound.movieUrl = "";
    GlobalContext.currentRound.mostRecentHappinessLevel = 0;
    
    //Increase game number for the next link
    GlobalContext.gameNumber ++;
    
    
    $(document).ready(function(){

     for (var i = 2*sc; i > 0; i-- ) {
       $("#bullets_hook").append("<div class='bullet animated bounceIn'></div>");
       $(".bullet").last().css({"left": Math.random() * 1200, "top": Math.random() * 500, "animation-delay": i*45+"ms" });
     }
     
     
   });
   

    context.gameOver = (GlobalContext.gameNumber >= GlobalContext.players.length * GlobalContext.roundsPerPlayer);

});