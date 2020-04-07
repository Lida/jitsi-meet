// @flow
import React, { Fragment } from 'react';

import { BaseApp } from '../features/base/app';
import { I18nextProvider } from 'react-i18next';
import { i18next } from '../features/base/i18n';
import { Provider } from 'react-redux';

import { AtlasKitThemeProvider } from '@atlaskit/theme';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { SoundCollection } from '../features/base/sounds';

import { DialogContainer } from '../features/base/dialog';
import { OverlayContainer } from '../features/overlay';

import { ChromeExtensionBanner } from '../features/chrome-extension-banner';
import '../features/base/user-interaction';
import '../features/chat';
import '../features/external-api';
import '../features/no-audio-signal';
import '../features/noise-detection';
import '../features/power-monitor';
import '../features/room-lock';
import '../features/talk-while-muted';
import '../features/video-layout';

import { AbstractApp } from '../features/app/components/AbstractApp';
import Home from './pages/Home';
import { Game } from './pages/Game';
/**
 * Root app {@code Component} on Web/React.
 *
 * @extends AbstractApp
 */
export class App extends BaseApp {

    /**
     * Don't use parent render and use our own routing
     *
     * @inheritdoc
     * @returns {ReactElement}
     */

    render() {
        const { store } = this.state;

        if (store) {
            return (
                <I18nextProvider i18n = { i18next }>
                    <Provider store = { store }>
                        <Fragment>
                            <AtlasKitThemeProvider mode = 'dark'>
                                <ChromeExtensionBanner />
                                <Router>
                                    <Switch>
                                    <Route exact path="/">
                                        <Home />
                                    </Route>
                                    <Route path="/:game/:room" children={<Game />} />
                                    </Switch>
                                </Router>                            
                            </AtlasKitThemeProvider>
                            <SoundCollection />
                            { this._createExtraElement() }
                            { this._renderDialogContainer() }
                        </Fragment>
                    </Provider>
                </I18nextProvider>
            );
        }

        return null;
    }

    /**
     * Creates an extra {@link ReactElement}s to be added (unconditionaly)
     * alongside the main element.
     *
     * @abstract
     * @protected
     * @returns {ReactElement}
     */
    _createExtraElement() {
        return (
            <Fragment>
                <OverlayContainer />
            </Fragment>
        );
    }

    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer() {
        return (
            <AtlasKitThemeProvider mode = 'dark'>
                <DialogContainer />
            </AtlasKitThemeProvider>
        );
    }
}
