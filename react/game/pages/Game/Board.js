// @flow

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import 'aframe';
import 'aframe-physics-system';
import 'aframe-template-component';

export default function Board(props) {
    let { game, room } = props;

    let buildFile = useSelector(state => state['game/buildFile'])
    let boardName = encodeURIComponent('Board OTB.jpg');
    //https://raw.githubusercontent.com/Lida/GameAndChat/master/public/Pandemic/images/Board%20OTB.jpg
    useEffect(() => {
        if (buildFile) {
            let boardImage = buildFile["Main Map"].image;
            const content = `
            <a-scene embedded>
            <a-assets>
                <script id="boxesTemplate" type="text/x-nunjucks-template">
                    <a-box color="{{box1color}}" position="-1 0 -5"></a-box>
                    <a-box color="{{box2color}}" position="0 1 -5"></a-box>
                    <a-box color="{{box3color}}" position="1 0 -5"></a-box>
                </script>
                <img id='board' src='./assets/${game}/images/${boardImage}' />
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
        }
    }, [game, buildFile]);

    return (
        <div id="aframe" style={{zIndex: 1}}/>
      );    
}