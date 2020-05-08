// @flow

import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../aframe';
import { gameSceneLoaded } from './actions';
import UI from './UI';

import nunjucks from 'nunjucks';

export default function Board(props) {
    let { game, room } = props;
    const dispatch = useDispatch();

    let buildFile = useSelector(state => state['game/buildFile'])
    useEffect(() => {
        if (buildFile) {
            nunjucks.configure('/assets/templates', { autoescape: true });
            AFRAME.registerState({
                initialState: {
                  shoppingList: [
                    {name: 'milk', amount: 2},
                    {name: 'eggs', amount: 12}
                  ]
                }
              });
            let boardImage = buildFile["Main Map"].image;
            let assetPath = `/assets/games/${game}/images/`
            // use template to setup asset management and scene initialization
            const content = nunjucks.render('scene.njk', { assetPath, boardImage, playerdeck: buildFile["Player Deck Start Board"].piles["Player Card Start Deck"], infectiondeck: buildFile["Main Map"].piles['Infection "Bottom of Deck"'] })
            let aframe = document.getElementById('aframe');
            aframe.addEventListener('contextmenu', (evt) => {
                console.log("context menu on aframe");
                console.log(evt)
                evt.preventDefault()
            })    

            aframe.innerHTML = content;
            // use code to do dynamic setups
            let run = () => {
                dispatch(gameSceneLoaded());
            }

            let scene = document.querySelector('a-scene');
            if (scene.hasLoaded) {
                run();
            } else {
                scene.addEventListener('loaded', run);
            }
        }
    }, [game, buildFile]);

    return (
        <Fragment>
            <div id="aframe" style={{zIndex: 1, pointerEvents: 'auto'}} />
        </Fragment>
    );    
}