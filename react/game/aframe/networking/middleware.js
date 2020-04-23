// @flow

import { MiddlewareRegistry } from '../../../features/base/redux';
import { ENDPOINT_MESSAGE_RECEIVED } from '../../../features/subtitles/actionTypes';

import { REMOTE_EVENT_TYPE, MOVE_PIECE } from './actionTypes';
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
    case ENDPOINT_MESSAGE_RECEIVED: // receive remote messages and dispatch locally
        let json = action.json;
        if (json.type && json.type == REMOTE_EVENT_TYPE) {
            return dispatchRemoteEvent(store, next, action);
        }
        break;
    case MOVE_PIECE:
        console.log(`moving piece ${action.id} to ${action.to}`);
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