'use strict';

var app = angular.module('wacoz', ['wacozapi']);
app.controller('MainController', function($scope, $http, nicoapi) {
    var fetchDateString = moment().format('YYYY-MM-DD');
    var url = 'http://live.nicovideo.jp/api/getZeroTimeline?date=' + fetchDateString;
    $http.get(url).then(function(response) {
        $scope.lives = _.filter(response.data.timeline.stream_list, function(live) {
            return live.status == 'comingsoon' && live.provider_type == 'official';
        });
    });

    $scope.onClickLive = function(liveId) {
        nicoapi.fetchOpenGateTime(liveId, function(time) {
            console.dir(time);
        });
    }
});
