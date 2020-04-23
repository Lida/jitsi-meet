import 'aframe';

export const REMOTE_EVENT_TYPE = 'RemoteEvent'

declare var APP: Object;

AFRAME.registerSystem('remote', {
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
