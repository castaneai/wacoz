'use strict';

var preservedLives = {};

function preserve(liveId, startTime) {
    preservedLives[liveId] = startTime;
}

function cancel(liveId) {

}
