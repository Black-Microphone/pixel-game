import { EventEmitter } from 'eventemitter3';
import { MutableRefObject } from 'react';
import { eventPixel, table } from './globalTypes';
import { randomPixel } from './globalFunc';
import { InitialMovesObject } from './moves';

function iniGuardianPixel(
    eventCenter: MutableRefObject<InstanceType<typeof EventEmitter<string | symbol, any>>>,
    table: MutableRefObject<table>
    ){

    const COLOR = 'rgb(184, 104, 38)' /* orange */;

    let { x: _X, y: _Y } = randomPixel(table);

    const { getSquare } = InitialMovesObject(table.current.length);

    let shieldsCoordinates: {x: number, y: number}[];
    
    const start: eventPixel = (index, mark, changeMark, color)=>{
        
        color.current = COLOR;
        changeMark(true);
        
    };

    const click: eventPixel = (index, mark, changeMark, color)=>{

        if((index.x === _X) && (index.y === _Y)){

            if(!mark) return;

            if(!shieldsCoordinates.length){

                changeMark(false);
                table.current[index.y][index.x].mark = false;

            }
            
        }else{
            
            changeMark(false);
            table.current[index.y][index.x].mark = false;
            shieldsCoordinates = shieldsCoordinates.filter(({x: X, y: Y})=>{

                return !((index.x === X) && (index.y === Y));

            })

        }

        
    };

    const end: eventPixel = (index, mark, changeMark, color)=>{
        
        
        
    };

    const shieldsObject: {[x: string]: {x: number, y: number}} = {};

    getSquare(_X, _Y, 1)
        .forEach(({ x, y })=>{

            if(!table.current[y][x].mark){

                shieldsObject[`${x}-${y}`] = {x, y};

            };

        })
        
    shieldsCoordinates = Object.values(shieldsObject);

    shieldsCoordinates.forEach(({x, y})=>{

        table.current[y][x].mark = true;
        eventCenter.current.emit(`pixel-${x}-${y}`, {start, click, end});

    });

    table.current[_Y][_X].mark = true;
    eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start, click, end});

}

export {

    iniGuardianPixel

}