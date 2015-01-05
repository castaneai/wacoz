app.service('NicoApi', ['$http', function($http) {

    this.fetchLives = function (date, callback) {
        var url = 'http://live.nicovideo.jp/api/getZeroTimeline?date=' + moment(date).format('YYYY-MM-DD');
        var jsonFilter = function(live) {
            return live.status == 'comingsoon' &&
                live.provider_type == 'official' &&
                live.description.indexOf("上映会") >= 0;
        };

        $http.get(url).success(function(response) {
            callback(_.filter(response.timeline.stream_list, jsonFilter));
        });
    };

    this.getOpenGateTime = function(liveID, callback) {
        var url = 'http://live.nicovideo.jp/gate/lv' + liveID;

        $http.get(url).success(function(response) {
            var openGateTimeString = jQuery(response).find('meta[itemprop=datePublished]').attr('content');
            var openGateTime = moment(openGateTimeString, 'YYYY-MM-DD HH:mmZZ');
            callback(openGateTime);
        });
    }

}]);