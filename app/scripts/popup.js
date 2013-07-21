'use strict';

function MainController($scope, $http) {
    var url = 'http://live.nicovideo.jp/api/getZeroTimeline?date=2013-07-21';
    $http.get(url).then(function(response) {
        $scope.lives = _.filter(response.data.timeline.stream_list, function(live) {
            return live.status == 'comingsoon' && live.provider_type == 'official';
        });
    });
}
