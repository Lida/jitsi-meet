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

 export const UNDO = Symbol();

 import { MiddlewareRegistry } from '../features/base/redux';

 let undoStack = []
/**
 * Middleware which intercepts undoable actions
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    if (action[UNDO]) {
        undoStack.push(action);
    }

    if (action == UNDO) {
        let action = undoStack.pop();
        return next(action[UNDO]);
    } else {
        return next(action);
    }
})