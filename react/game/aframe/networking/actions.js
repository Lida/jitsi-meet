import { MOVE_PIECE } from './actionTypes';

/**
 * Move piece from one location to another
 *
 * @param {data} data - The data for the game
 * @returns {{
 *     type: GAME_DEFINITION_LOADED,
 *     data: data
 * }}
 */
export function movePiece(id, to) {
    return {
        type: MOVE_PIECE,
        id,
        to
    };
}
