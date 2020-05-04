// @flow

import { MiddlewareRegistry } from '../features/base/redux';
import { ENDPOINT_MESSAGE_RECEIVED } from '../features/subtitles/actionTypes';

const REMOTE_EVENT_TYPE = 'RemoteEvent';

export const REPLICATE = Symbol();

declare var APP: Object;


function sendRemoteAction(action) {
    try {
        APP.conference.sendEndpointMessage('', {
            type: REMOTE_EVENT_TYPE,
            payload: action
        });
        console.log("sending remote event", action)
    } catch (e) {
        console.error(
            'Failed to send EndpointMessage via the datachannels',
            e);
    }
}

/**
 * Middleware which intercepts actions and updates the legacy component
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    // Forward any action that has replicate property set.
    if (action[REPLICATE]) {
        sendRemoteAction(action);
    }
    switch (action.type) {    
    case ENDPOINT_MESSAGE_RECEIVED: // receive remote messages and dispatch locally
        let json = action.json;
        if (json.type && json.type == REMOTE_EVENT_TYPE) {
            return dispatchRemoteEvent(store, next, action);
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