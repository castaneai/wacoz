var preservedLivesDict = {};

chrome.alarms.onAlarm.addListener(function(alarm) {
    var liveID = parseInt(alarm.name);
    enterLive(liveID);
});

chrome.notifications.onClicked.addListener(function(liveID) {
    openWatchPage(liveID);
});

var openWatchPage = function (liveID) {
    var url = "http://live.nicovideo.jp/watch/lv" + liveID;
    chrome.tabs.create({url: url});
};

var fetchXml = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        callback(xhr.responseXML);
    };
    xhr.send(null);
};

var enterLive = function (liveID) {
    var url = "http://live.nicovideo.jp/api/getplayerstatus?v=lv" + liveID;
    fetchXml(url, function(xml) {
        var status = xml.getElementsByTagName("getplayerstatus")[0].getAttribute("status");
        if (status != "ok") {
            return;
        }
        chrome.notifications.clear(liveID.toString(), function(){});
        // もう座席を取れたので予約からは消す
        cancel(liveID);
        var imageUrl = xml.getElementsByTagName("thumb_url")[0].textContent;
        var title = xml.getElementsByTagName("title")[0].textContent;
        var seat = xml.getElementsByTagName("room_label")[0].textContent +
            " - " + xml.getElementsByTagName("room_seetno")[0].textContent;
        chrome.notifications.create(liveID.toString(), {
            type: "basic",
            iconUrl: imageUrl,
            title: title,
            message: "座席取得に成功しました．" + seat
        }, function (id) {
            console.log("notify created:", id);
        });
    });
};


/**
 * 生放送の座席取得を予約する
 * @param liveId
 * @param startTime
 */
function preserve(liveId, startTime) {
    preservedLivesDict[liveId] = startTime;
    chrome.alarms.create(liveId.toString(), {
        when: startTime.getTime() + 2
    });
}

/**
 * 予約をキャンセルする
 * 予約されていない放送をキャンセルしても何も起こらない
 * @param liveId
 */
function cancel(liveId) {
    if (typeof(preservedLivesDict[liveId]) !== 'undefined') {
        delete preservedLivesDict[liveId];
    }
}
