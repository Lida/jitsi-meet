import 'aframe';

import { REMOTE_EVENT_TYPE } from './actionTypes';
declare var APP: Object;

AFRAME.registerSystem('networking', {
    schema: {

    },
    init: function() {

    },
    pause: function() {

    },
    play: function() {

    },
    tick: function() {
        //TODO: batch update
    },
    dispatch: function(action) {
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
})
