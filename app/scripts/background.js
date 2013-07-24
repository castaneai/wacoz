'use strict';

var preservedLives = {};

/**
 * 生放送の座席取得を予約する
 * @param liveId
 * @param startTime
 */
function preserve(liveId, startTime) {
    preservedLives[liveId] = startTime;
}

/**
 * 予約をキャンセルする
 * 予約されていない放送をキャンセルしても何も起こらない
 * @param liveId
 */
function cancel(liveId) {
    if (typeof(preservedLives[liveId]) !== 'undefined') {
        delete preservedLives[liveId];
    }
}
