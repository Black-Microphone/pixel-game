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

function isOverLimit(c: number){

    return ((c < 0) || (c > 15));

}

export {

    random,
    randomPixel,
    randomArrE,
    isOverLimit

}
  