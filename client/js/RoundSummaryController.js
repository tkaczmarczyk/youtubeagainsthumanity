 angular.module('YAH')
    .controller('RoundSummaryController', function(GlobalContext) {
    var context = this;
    context.GC = GlobalContext;
    context.forWhom = GlobalContext.getCurrentPlayer();
         
    context.gameOver = false;
    context.scoreThisRound = GlobalContext.currentRound.score;
    context.player = GlobalContext.getCurrentPlayer();
    
    GlobalContext.getCurrentPlayer().score += GlobalContext.currentRound.score;
    
    GlobalContext.currentRound.score = 0;
    GlobalContext.currentRound.movieUrl = "";
    GlobalContext.currentRound.mostRecentHappinessLevel = 0;
    
    //Increase game number for the next link
    GlobalContext.gameNumber ++;
    
    context.gameOver = (GlobalContext.gameNumber >= GlobalContext.players.length * GlobalContext.roundsPerPlayer);
});