// @flow

import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Game() {

    let videos = useSelector(state => state['game/videoTracks'])
    useEffect(() => {
        if (videos.length > 0) {
            document.getElementById('local').autoplay = true
            videos[0].jitsiTrack.attach(document.getElementById('local'))
        }
        if (videos.length > 1) {
            document.getElementById('remote').autoplay = true
            videos[1].jitsiTrack.attach(document.getElementById('remote'))
        }
    }, [videos])
    return (
        <Fragment>
            <video id="local" style={{zIndex: 2}}/>
            <video id="remote" style={{zIndex: 2}}/>
        </Fragment>
      );    
}