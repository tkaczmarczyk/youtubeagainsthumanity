 angular.module('YAH')
     .controller('EnterLinkController', function(GlobalContext, ngAudio) {
         var context = this;
         context.GC = GlobalContext;

         //Select current player
         context.forWhom = GlobalContext.players[1];
         
         GlobalContext.movieOutReady = false;
         GlobalContext.currentRound.movieUrl = "";
         

     });