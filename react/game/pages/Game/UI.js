// @flow

import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';


// Expected track to be a JitsiTrack audio track
function Audio({ track }) {
    let id = track.getId();
    useEffect(() => {
        track.attach(document.getElementById(id))
    }, [id])
    return (
        <audio id={id} style={{pointerEvents: 'auto'}}/>
    )
}

function Video({ track }) {
    let id = track.getId();
    useEffect(() => {
        let el = document.getElementById(id);
        el.autoplay = true;
        track.attach(el);
    }, [id])
    return (
        <video id={id} style={{pointerEvents: 'auto'}}/>
    )
}

export default function UI() {

    let videoTracks = useSelector(state => state['game/videoTracks'])
    let audioTracks = useSelector(state => state['game/audioTracks'])
    return (
        <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 2, pointerEvents: 'none'}}>
            {videoTracks.map(track => (
                <Video track={track.jitsiTrack} />
            ))}
            {audioTracks.map(track => (
                <Audio track={track.jitsiTrack} />
            ))}
        </div>
      );    
}