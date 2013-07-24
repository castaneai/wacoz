angular.module('wacozapi', []).service('nicoapi', function($http) {
    this.fetchOpenGateTime = function(liveId, callback) {
        $http.get('http://live.nicovideo.jp/gate/lv' + liveId).success(function(response) {
            var openGateTimeString = jQuery(response).find('meta[itemprop=datePublished]').attr('content');
            var openGateTime = moment(openGateTimeString, 'YYYY-MM-DD HH:mmZZ');
            callback(openGateTime);
        });
    }
});