// @flow

import React, { useEffect, useState, useCallback } from 'react';
import 'aframe';
import 'aframe-physics-system';
import 'aframe-template-component';
import { Conference } from '../../../features/conference';
import { useParams } from 'react-router-dom';
import Board from './Board';
import UI from './UI';

import type { Dispatch } from 'redux';
import { useSelector } from 'react-redux';


import { setRoom } from '../../../features/base/conference';
import {
    configWillLoad,
    createFakeConfig,
    loadConfigError,
    restoreConfig,
    setConfig,
    storeConfig
} from '../../../features/base/config';
import { connect, disconnect, setLocationURL } from '../../../features/base/connection';
import { loadConfig } from '../../../features/base/lib-jitsi-meet';
import { createDesiredLocalTracks } from '../../../features/base/tracks';
import {
    getBackendSafeRoomName,
    getLocationContextRoot,
    parseURIString,
    toURLString
} from '../../../features/base/util';

import logger from '../../../features/app/logger';

declare var APP: Object;
declare var interfaceConfig: Object;

export default function Game() {
    let { game, room } = useParams();
    useEffect(() => {
        APP.store.dispatch(connectToRoom(room));
    }, [])
    return (
        <div>
            <Board game={game} room={room} />
            <UI />
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