/** 
 * Undo for reducers can be implemented by keeping copy of previous state which requires all game state be kept in
 * redux which is not feasible due to updates potentially happening per frame per object.
 * Using command pattern doesn't really fit since the dispatch/action already is similar but different enough.
 * Instead we use a convention for actions and then this middleware to catch actions that are undoable to keep track off.
 * Then when undo is initiated, the undoable action stack is used to dispatch the undo version of the undoable actions.
 * Any reducer or middleware that respond to an action that is undoable must respond to the undo version of the action 
 * in order to make sure the undo is commplete. Unfortunately, this requires discipline and can't be enforced by the code,
 * except maybe through automated testing.
 * In order to write an action creator for an action that's undoable, it needs to import the UNDOABLE symbol and then
 * return an object with the obj[UNDO] set on it. The value set should be the action that should be dispatched when undoing.
 * 
 * So for example, if there is an action to move an object to a new position, the action creator might return
 * {
 *      type: 'MOVE_OBJECT',
 *      position: new_position,
 *      [UNDO]: {
 *          type: 'MOVE_OBJECT',
 *          position: old_position
 *      }
 * }
 */

export const UNDO = Symbol("UNDO");
export const REDO = Symbol("REDO");

import { MiddlewareRegistry } from '../features/base/redux';
import { ReducerRegistry } from '../features/base/redux';

ReducerRegistry.register('game/undoStack', (state = {history: [], current: 0}, action) => {

    if (action[UNDO]) { // if action is undoable
        state = Object.assign({}, state); // shallow copy state
        state.history = state.history.slice(0, state.current); // shallow copy the history up to current
        state.history.push(action); // add new action
        state.current += 1; // increase the current pointer
    } else if (action.type == UNDO) { // if action is undo
        state = Object.assign({}, state); // shallow copy state
        state.current = Math.min(0, state.current - 1); // move back current action pointer if possible
    } else if (action.type == REDO) { // if action is redo
        state = Object.assign({}, state); // shallow copy state
        state.current = Math.min(state.history.length, state.current + 1); // move forward the action pointer capped at the last history action
    }

    return state;
});

/**
 * Middleware which intercepts undoable actions
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    if (action.type == UNDO) {
        let result = next(action); // perform undo after state is updated
        let undoStack = store.getState()['game/undoStack'];
        let undoAction = undoStack.history[undoStack.current][UNDO];
        store.dispatch(undoAction);
        return result; 
    } else if (action.type == REDO) {
        let undoStack = store.getState()['game/undoStack'];
        if (undoStack.history[undoStack.current]) { // if not end of the history, intercept the redo to redo before updating the undo state
            let redoAction = Object.assign({}, undoStack.history[undoStack.current]); // shallow copy the action to redo
            delete redoAction[UNDO]; // do not set the UNDO to prevent pushing onto the history stack again.
            store.dispatch(redoAction);
        }
        return next(action);
    } else {
        return next(action);
    }
})