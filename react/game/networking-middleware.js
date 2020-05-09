// @flow

import { MiddlewareRegistry } from '../features/base/redux';
import { ENDPOINT_MESSAGE_RECEIVED } from '../features/subtitles/actionTypes';
import { GAME_SCENE_LOADED } from './pages/Game/actionTypes';
import { DATA_CHANNEL_OPENED } from '../features/base/conference';

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

let gameLoaded = false;
let conferenceJoined = false;
let gameSynced = false;
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
            gameLoaded = true;
            break;
        case DATA_CHANNEL_OPENED:
            conferenceJoined = true;
            break;
        case SYNC_GAME_ACTIONS: // send all previous network messages so participant catches up, only if we are the first moderator
            {
                let roomCreator = localStorage.getItem('createdRoom') == store.getState()['features/base/conference'].room;
                if (roomCreator) { // I am the room host/creator, so I should reply to sync message
                    let id = action.participant._id;
                    let i = 0;
                    for (const replicated of ReplicatedActions) {
                        replicated.index = i;
                        i++;
                        sendRemoteAction(replicated, id);
                    }
                }
            }
            break;
        case ENDPOINT_MESSAGE_RECEIVED: // receive remote messages and dispatch locally
            let json = action.json;
            if (json.type && json.type == REMOTE_EVENT_TYPE) {
                let payload = action.json.payload;
                if (payload.type != SYNC_GAME_ACTIONS) { // ignore sync actions
                    console.log(payload);
                    ReplicatedActions.push(Object.assign({}, payload));
                } else {
                    payload.participant = action.participant; // append participant to sync messages
                }
                return store.dispatch(payload);
            }
            break;
    }
    if (gameLoaded && conferenceJoined && !gameSynced ) { // If not the one to host the game, ask to sync the game once joined the conference
        let roomCreator = localStorage.getItem('createdRoom') == store.getState()['features/base/conference'].room;
        if (!roomCreator) {
            sendRemoteAction({type: SYNC_GAME_ACTIONS});
        }
        gameSynced = true;
    }
    return result;
});