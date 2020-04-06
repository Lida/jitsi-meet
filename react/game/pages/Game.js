// @flow

import React, { useEffect, useState, useCallback } from 'react';
import 'aframe';
import 'aframe-physics-system';
import 'aframe-template-component';
import { Conference } from '../../features/conference';
import { useParams } from 'react-router-dom';

import type { Dispatch } from 'redux';

import { setRoom } from '../../features/base/conference';
import {
    configWillLoad,
    createFakeConfig,
    loadConfigError,
    restoreConfig,
    setConfig,
    storeConfig
} from '../../features/base/config';
import { connect, disconnect, setLocationURL } from '../../features/base/connection';
import { loadConfig } from '../../features/base/lib-jitsi-meet';
import { createDesiredLocalTracks } from '../../features/base/tracks';
import {
    getBackendSafeRoomName,
    getLocationContextRoot,
    parseURIString,
    toURLString
} from '../../features/base/util';

import {
    getDefaultURL,
    getName
} from '../../features/app/functions';
import logger from '../../features/app/logger';

declare var APP: Object;
declare var interfaceConfig: Object;

export default function Game() {
    let { room } = useParams();
    useEffect(() => {
        APP.store.dispatch(connectToRoom(room));
    }, [])
    let game = 'Pandemic'
    // let boardName = window.Game.BasicModule.Map[4].BoardPicker.Board._attributes.image;
    let boardName = encodeURIComponent('Board OTB.jpg');
    //https://raw.githubusercontent.com/Lida/GameAndChat/master/public/Pandemic/images/Board%20OTB.jpg
    useEffect(() => {
        const content = `
        <a-scene embedded>
        <a-assets>
            <script id="boxesTemplate" type="text/x-nunjucks-template">
                <a-box color="{{box1color}}" position="-1 0 -5"></a-box>
                <a-box color="{{box2color}}" position="0 1 -5"></a-box>
                <a-box color="{{box3color}}" position="1 0 -5"></a-box>
            </script>
            <img id='board' src='https://raw.githubusercontent.com/Lida/GameAndChat/master/public/${game}/images/${boardName}' />
        </a-assets>
        <a-entity id='rig' movement-controls>
            <a-camera fov='50' ></a-camera>
        </a-entity>
        <a-entity template="src: #boxesTemplate"
            data-box1color="red" data-box2color="green" data-box3color="blue"></a-entity>
        <a-image
        src= '#board'
        static-body
        position='0 -2 -3'
        rotation='-90 0 0'
        width='6'
        height='4'>
        </a-image>
        <a-box dynamic-body position='-1 0.5 -3' rotation='44 44 0' color='#4CC3D9'>
        </a-box>
        <a-sphere dynamic-body position='0 1.25 -5' radius='1.25' color='#EF2D5E'>
        </a-sphere>
        <a-cylinder
        dynamic-body 
        position='1 0.75 -3'
        radius='0.5'
        height='1.5'
        color='#FFC65D'
        >
        </a-cylinder>
        <a-light type='ambient' color='#445451'></a-light>
        
        <a-light type='point' intensity='2' position='2 4 4'></a-light>

        <a-sky color='#333333' />
    </a-scene>
        `;
        document.getElementById('aframe').innerHTML = content;
    }, [game, boardName]);

    return (
        <div>
            <Conference />
        </div>
      );    
}

function connectToRoom(room: string) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        let location = parseURIString(window.location.href);
        location.protocol || (location.protocol = 'https:');
        const { contextRoot, host } = location;
        const locationURL = new URL(location.toString());

        dispatch(configWillLoad(locationURL, room));

        let protocol = location.protocol.toLowerCase();

        // The React Native app supports an app-specific scheme which is sure to not
        // be supported by fetch.
        protocol !== 'http:' && protocol !== 'https:' && (protocol = 'https:');

        const baseURL = `${protocol}//${host}${contextRoot || '/'}`;
        let url = `${baseURL}config.js`;

        // XXX In order to support multiple shards, tell the room to the deployment.
        room && (url += `?room=${getBackendSafeRoomName(room)}`);

        let config;

        // Avoid (re)loading the config when there is no room.
        if (!room) {
            config = restoreConfig(baseURL);
        }

        if (!config) {
            try {
                config = await loadConfig(url);
                dispatch(storeConfig(baseURL, config));
            } catch (error) {
                config = restoreConfig(baseURL);

                if (!config) {
                    if (room) {
                        dispatch(loadConfigError(error, locationURL));

                        return;
                    }

                    // If there is no room (we are on the welcome page), don't fail, just create a fake one.
                    logger.warn('Failed to load config but there is no room, applying a fake one');
                    config = createFakeConfig(baseURL);
                }
            }
        }

        if (getState()['features/base/config'].locationURL !== locationURL) {
            dispatch(loadConfigError(new Error('Config no longer needed!'), locationURL));

            return;
        }

        dispatch(setLocationURL(locationURL));
        dispatch(setConfig(config));
        dispatch(setRoom(room));
        dispatch(connect());
    };
}