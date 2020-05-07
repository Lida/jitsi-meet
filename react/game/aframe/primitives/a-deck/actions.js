import { DRAW_PIECE } from './actionTypes';
import { REPLICATE } from '../../../networking-middleware';
/**
 * Signals that game definition was loaded
 *
 * @param {data} data - The data for the game
 * @returns {{
 *     type: GAME_DEFINITION_LOADED,
 *     data: data
 * }}
 */
export function drawPiece(from, element, to) {
    return {
        type: DRAW_PIECE,
        from: from.id,
        element: element.id,
        to: to.id,
        [REPLICATE]: true
    };
}
