import { EventEmitter } from 'eventemitter3';
import { MutableRefObject } from 'react';
import { eventPixel, table } from './globalTypes';
import { InitialMovesObject } from './moves';
import { randomPixel } from './globalFunc';

function iniMutantPixel(
    eventCenter: MutableRefObject<InstanceType<typeof EventEmitter<string | symbol, any>>>, 
    table: MutableRefObject<table>
    ){

    const size = table.current.length;

    const MOVES = InitialMovesObject(size);
    const { GroupMovesCardinalsByLimits } = MOVES;

    const COLOR = 'rgb(172, 38, 184)'; /* pink */;

    let { x: _X, y: _Y } = randomPixel(table);

    let currentPixels: {x: number, y: number}[] = [];

    function randomPart(){
        
        const pixelsAndMoves = currentPixels.map(({x: X, y: Y})=> {
            
            const movesFree = GroupMovesCardinalsByLimits
                .filter(({isOverLimit})=> !isOverLimit(X, Y))
                .map(({move})=>move(X, Y))
                .filter(({x, y})=>{

                    if(table.current[y][x].mark){

                        return false;

                    } else return true;

                });

            return movesFree;

        }).filter(v=>v.length);

        const pixelMoves = pixelsAndMoves[Math.floor(pixelsAndMoves.length*Math.random())];

        return pixelMoves[Math.floor(pixelMoves.length*Math.random())]

    }

    let tempTimeInterval: any = undefined;

    const start: eventPixel = (index, mark, changeMark, color)=>{
        
        color.current = COLOR;
        changeMark(true);
        
    };

    const click: eventPixel = (index, mark, changeMark, color)=>{
        
        if(!mark) return;

        clearInterval(tempTimeInterval);
        changeMark(false);
        
    };

    const end: eventPixel = (index, mark, changeMark, color)=>{
        
        
        
    };

    const last: eventPixel = (index, mark, changeMark, color)=>{
        
        changeMark(false);
        
    };

    tempTimeInterval = setInterval(()=>{

        const { x, y } = randomPart();

        _X = x;
        _Y = y;

        table.current[_Y][_X].mark = true;
        eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start, click, end});
        currentPixels.push({x: _X, y: _Y});
        
    }, 1500);

    table.current[_Y][_X].mark = true;
    eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start, click, end});
    currentPixels.push({x: _X, y: _Y});

}

export {

    iniMutantPixel

}