// @flow

import { MiddlewareRegistry } from '../features/base/redux';
import { ENDPOINT_MESSAGE_RECEIVED } from '../features/subtitles/actionTypes';
import { GAME_SCENE_LOADED } from './pages/Game/actionTypes';

const REMOTE_EVENT_TYPE = 'RemoteEvent';

const SYNC_GAME_ACTIONS = 'SYNC_GAME_ACTIONS';

export const REPLICATE = Symbol();

declare var APP: Object;


function sendRemoteAction(action, to = '') {
    try {
        APP.conference.sendEndpointMessage(to, {
            type: REMOTE_EVENT_TYPE,
            payload: action
        });
        // console.log("sending remote event", action)
    } catch (e) {
        console.error(
            'Failed to send EndpointMessage via the datachannels',
            e);
    }
}

let ReplicatedActions = [];

/**
 * Middleware which intercepts actions and updates the legacy component
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    let result = next(action);
    let participants = store.getState()['features/base/participants'];
    let me = participants.find(part => part.local);
    // Forward any action that has replicate property set.
    if (action[REPLICATE]) {
        ReplicatedActions.push(Object.assign({}, action));
        if (participants.length > 1) { // only try to broadcast when there are other participants
            sendRemoteAction(action);
        }
    }
    switch (action.type) {
        case GAME_SCENE_LOADED:
            if (me.role != 'moderator') { // If not the one to host the game, ask to sync the game from the moderator
                let mod = participants.find(part => part.role == 'moderator');
                if (mod) {
                    sendRemoteAction({type: SYNC_GAME_ACTIONS}, mod.id);
                }
            }
            break;
        case SYNC_GAME_ACTIONS: // send all previous network messages so participant catches up, only if we are the first moderator
            if (me.role == 'moderator') { // I am the moderator, so I should send messages recently joined participant to catch up
                for (const action of ReplicatedActions) {
                    sendRemoteAction(action, action.participant.id);
                }
            }
            break;
        case ENDPOINT_MESSAGE_RECEIVED: // receive remote messages and dispatch locally
            let json = action.json;
            if (json.type && json.type == REMOTE_EVENT_TYPE) {
                let payload = action.json.payload;
                if (action.type != SYNC_GAME_ACTIONS) { // ignore sync actions
                    ReplicatedActions.push(Object.assign({}, action));
                } else {
                    payload.participant = action.participant; // append participant to sync messages
                }
                return store.dispatch(payload);
            }
            break;
    }
    return result;
});