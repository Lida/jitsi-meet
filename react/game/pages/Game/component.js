// @flow

import React, { useEffect } from 'react';
import 'aframe';
import 'aframe-physics-system';
import 'aframe-template-component';
import { Conference } from '../../../features/conference';
import { useParams } from 'react-router-dom';
import Board from './Board';
import convert from 'xml-js';
import { gameLoaded } from './actions';

import type { Dispatch } from 'redux';


import { setRoom } from '../../../features/base/conference';
import {
    configWillLoad,
    createFakeConfig,
    loadConfigError,
    restoreConfig,
    setConfig,
    storeConfig
} from '../../../features/base/config';
import { connect, setLocationURL } from '../../../features/base/connection';
import { loadConfig } from '../../../features/base/lib-jitsi-meet';
import {
    getBackendSafeRoomName,
    parseURIString,
} from '../../../features/base/util';

import logger from '../../../features/app/logger';

declare var APP: Object;
declare var interfaceConfig: Object;

export default function Game() {
    let { game, room } = useParams();
    useEffect(() => {
        APP.store.dispatch(connectToRoom(room));
        APP.store.dispatch(loadGame(game));
    }, [])
    return (
        <div>
            <Board game={game} room={room} />
            <Conference />
        </div>
      );    
}

// Parse the weird serialization data in buildFile
function parseText(text) {
    let command = text.split('/');
    return {
        command: command[0],
        id: command[1],
        type: command[2].split("\t").reduce((ret, type) => {
            let value = type.split(";").map((v) => {
                while (v.indexOf("\\") >= 0) {
                    v = v.replace('\\', ''); // There is some escape string encoding \ that we need to strip. Not sure what \ decodes to though
                }
                return v;
            })
            ret[value[0]] = value
            return ret
        }, {}),
        state: command[3]
    }
}

function loadGame(game: string) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        let response = await fetch(`/assets/games/${game}/buildFile`);
        let text = await response.text()
        let buildFile = convert.xml2js(text, {
            compact: true,
            elementNameFn: function(val) {
                return val.split(".").pop();
            }
        });
        window.Game = buildFile // make it available as a global for debugging purposes
        // extract the important parts of the buildFile.
        let prototypes = window.Game.BasicModule.PrototypesContainer.PrototypeDefinition.reduce((ret, prototype) => {
            ret[prototype._attributes.name] = parseText(prototype._text)
            return ret
        }, {});
        let maps = buildFile.BasicModule.Map.reduce((ret, map) => {
            if (map.DrawPile) {
                let piles = map.DrawPile.reduce((ret, pile) => {
                    if (pile.CardSlot) {
                        ret[pile._attributes.name] = pile.CardSlot.map((card) => {
                            let data = parseText(card._text);
                            let image = data.type.piece[3]; // https://github.com/fifa0329/vassal/tree/master/src/VASSAL/counters/BasicPiece.java#L129
                            return {
                                name: card._attributes.entryName,
                                front: image,
                                back: data.type.prototype && prototypes[data.type.prototype[1]] && prototypes[data.type.prototype[1]].type.obs ? prototypes[data.type.prototype[1]].type.obs[2] : null // Get prototype's obs image if there is a prototype
                            }
                        })
                    }
                    return ret
                }, []);
                ret[map._attributes.mapName] = {
                    image: map.BoardPicker.Board._attributes.image,
                    piles: piles
                }
            }
            return ret
        }, [])
        dispatch(gameLoaded(maps))
    }    
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