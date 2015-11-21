 angular.module('YAH')
    .controller('GameSummaryController', function(GlobalContext) {
    var context = this;
    context.GC = GlobalContext;

    context.playersSorted = GlobalContext.players.sort(function(a, b){return a.score-b.score});
});