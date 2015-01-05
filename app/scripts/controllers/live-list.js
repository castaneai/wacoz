var app = angular.module('wacoz', []);
app.controller('LiveListController', ['$scope', 'NicoApi', function($scope, NicoApi) {

    // view scope vars...
    $scope.lives = [];

    NicoApi.fetchLives(new Date(), function(lives) {
        $scope.lives = lives;
    });

    $scope.onClickLive = function(live) {
        NicoApi.getOpenGateTime(live.id, function(date) {
            console.log(live.title, "開場時刻:", date);
        });
    };

}]);