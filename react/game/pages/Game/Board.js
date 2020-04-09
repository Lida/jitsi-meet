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
            const content = nunjucks.render('scene.njk', { game, boardImage })
            document.getElementById('aframe').innerHTML = content;    
        }
    }, [game, buildFile]);

    return (
        <div id="aframe" style={{zIndex: 1}}/>
      );    
}