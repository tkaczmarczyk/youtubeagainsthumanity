 angular.module('YAH')
     .controller('EnterLinkController', function(GlobalContext) {
         var context = this;
         context.GC = GlobalContext;

         //Select current player
         context.forWhom = GlobalContext.getCurrentPlayer();

         GlobalContext.currentRound.movieUrl = "";
     });