import { MiddlewareRegistry } from '../../features/base/redux';
import { DRAW_PIECE } from './primitives/a-deck'
// Middleware to allow AFRAME access to dispatched redux actions
MiddlewareRegistry.register(store => next => action => {
    if (action.type == DRAW_PIECE) {
        console.log(action)
    }
    return next(action);
});