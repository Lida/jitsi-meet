// @flow

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import '../../aframe';

import nunjucks from 'nunjucks';

export default function Board(props) {
    let { game, room } = props;

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
            let piles = buildFile["Player Deck Start Board"].piles;
            // use template to setup asset management and scene initialization
            const content = nunjucks.render('scene.njk', { game, boardImage, playerdeck: piles["Player Card Start Deck"], infectiondeck: buildFile["Main Map"].piles['Infection "Bottom of Deck"'] })
            let aframe = document.getElementById('aframe');
            aframe.addEventListener('contextmenu', (evt) => {
                console.log("context menu on aframe");
                console.log(evt)
                evt.preventDefault()
            })    

            aframe.innerHTML = content;
            // use code to do dynamic setups
            // let scene = document.getElementById('scene');
            // scene.addEventListener('click', (evt) => {
            //     console.log("clicked!");
            //     console.log(evt)
            // })
            // scene.addEventListener('mouseenter', (evt) => {
            //     console.log("hover");
            //     console.log(evt)
            // })
        }
    }, [game, buildFile]);

    return (
        <div id="aframe" style={{zIndex: 1}}/>
      );    
}