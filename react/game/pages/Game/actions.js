import { GAME_DEFINITION_LOADED } from './actionTypes';

/**
 * Signals that game definition was loaded
 *
 * @param {data} data - The data for the game
 * @returns {{
 *     type: GAME_DEFINITION_LOADED,
 *     data: data
 * }}
 */
export function gameLoaded(data: Object) {
    return {
        type: GAME_DEFINITION_LOADED,
        data
    };
}
