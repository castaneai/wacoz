var back = chrome.extension.getBackgroundPage();
var app = angular.module('wacoz', []);
app.controller('LiveListController', ['$scope', 'NicoApi', function($scope, NicoApi) {

    $scope.lives = [];

    NicoApi.fetchLives(new Date(), function(lives) {
        $scope.lives = lives;
    });

    $scope.onClickLive = function(live) {
        if ($scope.isPreserved(live.id)) {
            back.cancel(live.id);
            return;
        }

        NicoApi.getOpenGateTime(live.id, function (openTimeMoment) {
            back.preserve(live.id, openTimeMoment.toDate());
        });
    };

    $scope.isPreserved = function(liveID) {
        return _.has(back.preservedLivesDict, liveID);
    }

}]);