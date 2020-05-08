import { GAME_DEFINITION_LOADED, GAME_SCENE_LOADED } from './actionTypes';

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

/**
 * Signals that game scene has finished initialization
 *
 * @param {data} data - The data for the game
 * @returns {{
    *     type: GAME_SCENE_LOADED,
    * }}
    */
   export function gameSceneLoaded(data: Object) {
       return {
           type: GAME_SCENE_LOADED,
       };
   }
   
   