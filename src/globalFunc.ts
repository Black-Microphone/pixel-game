import { table } from './globalTypes';
import { InitialMovesObject } from './moves';

function randomPixel(table: table){

    const Y = Math.floor(table.length*Math.random());

    const row = table[Y].filter(v=>!v.mark);

    const { x, y } = row[Math.floor(row.length*Math.random())];

    return { x, y };
  
}

const random = (n: number) => Math.floor(Math.random()*n);

// getFeeOrtogonalMoves
function getFeeOrtogonalMovesIfUnMark(table: table, x: number, y: number, moves: ){



}


export {

    random,
    randomPixel

}
  