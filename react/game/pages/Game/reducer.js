import { PARTICIPANT_ID_CHANGED } from '../../../features/base/participants';
import { ReducerRegistry, set } from '../../../features/base/redux';

import { GAME_DEFINITION_LOADED } from './actionTypes';
import {
    SET_NO_SRC_DATA_NOTIFICATION_UID,
    TRACK_ADDED,
    TRACK_CREATE_CANCELED,
    TRACK_CREATE_ERROR,
    TRACK_NO_DATA_FROM_SOURCE,
    TRACK_REMOVED,
    TRACK_UPDATED,
    TRACK_WILL_CREATE
} from '../../../features/base/tracks';

/**
 * Listen for actions that mutate (e.g. add, remove) local and remote tracks.
 */
ReducerRegistry.register('game/videoTracks', (state = [], action) => {
    switch (action.type) {      
    case PARTICIPANT_ID_CHANGED:
    case TRACK_NO_DATA_FROM_SOURCE:
    case TRACK_UPDATED:
        return state;

    case TRACK_ADDED: {
        console.log(action)
        if (action.track.mediaType == "video") {
            return [ ...state, action.track ];
        }
    }

    case TRACK_CREATE_CANCELED:
    case TRACK_CREATE_ERROR: {
        return state.filter(t => !t.local || t.mediaType !== action.trackType);
    }

    case TRACK_REMOVED:
        return state.filter(t => t.jitsiTrack !== action.track.jitsiTrack);

    case TRACK_WILL_CREATE:
        console.log(action)
        if (action.track.mediaType == "video") {
            return [ ...state, action.track ];
        }

    default:
        return state;
    }
});

/**
 * Listen for actions that mutate (e.g. add, remove) game data
 */

ReducerRegistry.register('game/buildFile', (state = null, action) => {
    switch (action.type) {
    case GAME_DEFINITION_LOADED:
        return action.data;
    default:
        return state;
    }
});