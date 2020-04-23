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
    }
    return next(action);
});