// @flow

import { CONFERENCE_JOINED, CONFERENCE_WILL_LEAVE } from '../../../features/base/conference';
import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_UPDATED,
    PIN_PARTICIPANT,
    getParticipantById
} from '../../../features/base/participants';
import { MiddlewareRegistry } from '../../../features/base/redux';
import { TRACK_ADDED, TRACK_REMOVED } from '../../../features/base/tracks';
import { ENDPOINT_MESSAGE_RECEIVED } from '../../../features/subtitles/actionTypes';

import { REMOTE_EVENT_TYPE } from '../../aframe/remote-system';
declare var APP: Object;

/**
 * Middleware which intercepts actions and updates the legacy component
 * {@code VideoLayout} as needed. The purpose of this middleware is to redux-ify
 * {@code VideoLayout} without having to simultaneously react-ifying it.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case CONFERENCE_JOINED:
        break;

    case CONFERENCE_WILL_LEAVE:
        break;

    case PARTICIPANT_JOINED:
        break;

    case PARTICIPANT_LEFT:
        break;

    case PARTICIPANT_UPDATED: 
        break;
    
    case DOMINANT_SPEAKER_CHANGED:
        break;

    case PIN_PARTICIPANT:
        break;

    case TRACK_ADDED:
        break;
    
    case TRACK_REMOVED:
        break;
    
    case ENDPOINT_MESSAGE_RECEIVED:
        let json = action.json;
        if (json.type && json.type == REMOTE_EVENT_TYPE) {
            return dispatchRemoteEvent(state, next, action);
        }
        break;
    }

    return next(action);
});
/**
 * Dispatch remote events locally
 * 
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} to the specified {@code store}.
 * @param {Action} action - The redux action {@code CONFERENCE_JOINED} which is
 * being dispatched in the specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function dispatchRemoteEvent({ dispatch, getState }, next, action) {
    const result = next(action);
    console.log("dispatching remote event", action);
    dispatch(action.json.payload);
    return result;
}