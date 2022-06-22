import { MutableRefObject } from 'react';
import { table } from './globalTypes';

const random = (n: number) => Math.floor(Math.random()*n);

function randomPixel(table: MutableRefObject<table>){

    const Y = Math.floor(table.current.length*Math.random());

    const row = table.current[Y].filter(v=>!v.mark);

    const { x, y } = row[Math.floor(row.length*Math.random())];

    return { x, y };
  
}

function randomArrE<T>(array: T[]){

    return array[Math.floor(array.length*Math.random())];

}

export {

    random,
    randomPixel,
    randomArrE

}
  