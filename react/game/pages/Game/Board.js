// @flow

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import 'aframe';
import 'aframe-physics-system';
import 'aframe-template-component';
import 'aframe-state-component';
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
            const content = nunjucks.render('scene.njk', { game, boardImage, deck: piles["Player Card Start Deck"] })
            document.getElementById('aframe').innerHTML = content;
            let scene = document.getElementById('scene');
            scene.addEventListener('click', (evt) => {
                console.log("clicked!");
                console.log(evt)
            })
            scene.addEventListener('mouseenter', (evt) => {
                console.log("hover");
                console.log(evt)
            })
        }
    }, [game, buildFile]);

    return (
        <div id="aframe" style={{zIndex: 1}}/>
      );    
}