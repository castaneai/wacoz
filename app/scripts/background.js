/**
 * 現在予約中の生放送一覧
 * @type {Object.<number, Date>}
 */
var preservedLivesDict = {};

var getPreservedCount = function() {
    return Object.keys(preservedLivesDict).length;
};

/**
 * 開場時刻になった時に発生するアラームイベント
 */
chrome.alarms.onAlarm.addListener(function(alarm) {
    var liveID = parseInt(alarm.name);
    enterLive(liveID);
});

/**
 * デスクトップ通知がクリックされた時に発生するイベント
 */
chrome.notifications.onClicked.addListener(function(liveID) {
    openWatchPage(liveID);
});

/**
 * 指定した生放送IDの放送の視聴ページを新しいタブで開く
 * @param liveID 生放送ID
 * @param isBackground
 */
var openWatchPage = function (liveID, isBackground) {
    var url = "http://live.nicovideo.jp/watch/lv" + liveID;
    chrome.tabs.create({url: url, active: !isBackground});
};

/**
 * 指定したURLをXMLデータとして取得する
 * @param url
 * @param callback
 */
var fetchXml = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        callback(xhr.responseXML);
    };
    xhr.send(null);
};

/**
 * 座席を確保し，生放送に入場する
 * @param liveID
 */
var enterLive = function (liveID) {
    var url = "http://live.nicovideo.jp/api/getplayerstatus?v=lv" + liveID;
    fetchXml(url, function(xml) {
        // 座席確保成功したかどうかを確認する
        var status = xml.getElementsByTagName("getplayerstatus")[0].getAttribute("status");
        var success = status == "ok";
        if (success == false) {
            return;
        }

        // 視聴ページを自動で開く
        openWatchPage(liveID, true);

        // もう座席を取れたので予約からは消す
        cancel(liveID);

        var imageUrl = xml.getElementsByTagName("thumb_url")[0].textContent;
        var title = xml.getElementsByTagName("title")[0].textContent;
        var seat = xml.getElementsByTagName("room_label")[0].textContent +
            " - " + xml.getElementsByTagName("room_seetno")[0].textContent;

        // クリアしないと同じ放送を二回予約した場合に前の通知が残ってしまい
        // 二回目以降通知が省略されてしまうので必ずクリアする
        chrome.notifications.clear(liveID.toString(), function(){});
        var notificationOptions = {
            type: "basic",
            iconUrl: imageUrl,
            title: title,
            message: "座席取得に成功しました．" + seat
        };
        // 通知を表示する
        chrome.notifications.create(liveID.toString(), notificationOptions, function(){});
    });
};


/**
 * 生放送の座席取得を予約する
 * @param liveId
 * @param startTime
 */
function preserve(liveId, startTime) {
    preservedLivesDict[liveId] = startTime;
    chrome.browserAction.setBadgeText({text: getPreservedCount().toString()});
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
        chrome.browserAction.setBadgeText({
            text: getPreservedCount() > 0 ? getPreservedCount().toString() : ''
        });
    }
}
