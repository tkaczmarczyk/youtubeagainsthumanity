 angular.module('YAH')
    .controller('GameSummaryController', function(GlobalContext, ngAudio) {
    var context = this;
    context.GC = GlobalContext;
    context.forWhom = GlobalContext.getCurrentPlayer();
         
    context.playersSorted = GlobalContext.players.sort(function(a, b){return a.score-b.score});
    
    ngAudio.load("/client/audio/duckarmy.mp3").play();
});