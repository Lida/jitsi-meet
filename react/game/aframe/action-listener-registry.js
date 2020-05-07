// @flow

import { MiddlewareRegistry } from '../../features/base/redux';
import type { Store } from 'redux';


/**
 * The type listener supported for registration with
 * {@link StateListenerRegistry} in association with a {@link Selector}.
 *
 * @param {any} selection - The value derived from the redux store/state by the
 * associated {@code Selector}. Immutable!
 * @param {Store} store - The redux store. Provided in case the {@code Listener}
 * needs to {@code dispatch} or {@code getState}. The latter is advisable only
 * if the {@code Listener} is not to respond to changes to that state.
 * @param {any} prevSelection - The value previously derived from the redux
 * store/state by the associated {@code Selector}. The {@code Listener} is
 * invoked only if {@code prevSelection} and {@code selection} are different.
 * Immutable!
 */
type ActionListener
    = (store: Store<*, *>, action: any) => void;


/**
 * A registry listeners which listen to changes in a redux store/state.
 */
class ActionListenerRegistry {

    /**
     * The {@link Listener}s registered with this {@code StateListenerRegistry}
     * to be notified when the values derived by associated {@link Selector}s
     * from a redux store/state change.
     */
    _listeners: Set<ActionListener> = new Set();

    /**
     * Invoked by a specific redux store any time an action is dispatched, and
     * some part of the state (tree) may potentially have changed.
     *
     * @param {Object} context - The redux store invoking the listener and the
     * private makstate of this {@code StateListenerRegistry} associated with the
     * redux store.
     * @returns {void}
     */
    _notify(store: Store<*, *>, action: any) {
        for (const listener of this._listeners) {
            try {
                listener(store, action);
            } catch (e) {
                // Don't let one faulty listener prevent other listeners from
                // being notified about their associated changes.
                logger.error(e);
            }
        }
    }

    /**
     * Registers a specific listener to be notified when the value derived by a
     * specific {@code selector} from a redux store/state changes.
     *
     * @param {Function} selector - The pure {@code Function} of the redux
     * store/state (and the previous selection of made by {@code selector})
     * which selects the value listened to by the specified {@code listener}.
     * @param {Function} listener - The listener to register with this
     * {@code StateListenerRegistry} so that it gets invoked when the value
     * returned by the specified {@code selector} changes.
     * @returns {void}
     */
    register(listener: ActionListener) {
        this._listeners.add(listener);
    }

}

const registry = new ActionListenerRegistry();

// Middleware to allow AFRAME access to dispatched redux actions
MiddlewareRegistry.register(store => next => action => {
    let result = next(action);
    registry._notify(store, action);
    return result;
});

export default registry;
