// @flow

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import 'aframe';
import 'aframe-physics-system';
import 'aframe-template-component';
import 'aframe-state-component';
import nunjucks from 'nunjucks';


AFRAME.registerComponent('piece', {
    schema: {
        front: {type: 'asset'},
        back: {type: 'asset'}, // if null will use the same as the front but mirrored
        width: {default: 0.6},
        height: {default: 1},
        depth: {default: 0.02}
    },
    init: function () {
        this.el.setAttribute('geometry', {primitive: 'plane'});
        this.el.setAttribute('material', {
            color: '#FFF',
            shader: 'flat',
            side: 'double',
            transparent: true
        })
        this.el.setAttribute('body', {type: 'static', shape: 'none'})
        this.el.setAttribute('shape', {shape: 'box'})
    },
    update: function (oldData) {
        this.el.setAttribute('geometry', {width: this.data.width, height: this.data.height})
        this.el.setAttribute('shape', 'halfExtents', {x: this.data.width / 2, y: this.data.height / 2, z: this.data.depth / 2})
        this.el.setAttribute('material', 'src', this.data.front)
    }
})

AFRAME.registerPrimitive('a-piece', {
    defaultComponents: {
        piece: {},
    },
    mappings: {
        front: 'piece.front',
        back: 'piece.back',
        width: 'piece.width',
        height: 'piece.height',
        depth: 'piece.depth',
    }
});

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
            const content = nunjucks.render('scene.njk', { game, boardImage, deck: piles["Player Card Start Deck"] })
            document.getElementById('aframe').innerHTML = content;
            // use code to do dynamic setups
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