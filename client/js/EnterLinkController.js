 angular.module('YAH')
     .controller('EnterLinkController', function(GlobalContext) {
         var context = this;
         context.GC = GlobalContext;
         context.movieLink = "";
         context.for_whom = GlobalContext.players[0].name;


     });