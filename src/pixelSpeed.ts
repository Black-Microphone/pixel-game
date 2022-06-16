import { EventEmitter } from 'eventemitter3';
import { MutableRefObject } from 'react';
import { eventPixel, table } from './globalTypes';
import { InitialMovesObject } from './moves';
import { randomPixel } from './globalFunc';

function initSpeedPixel(eventCenter: MutableRefObject<InstanceType<typeof EventEmitter<string | symbol, any>>>, table: table){

    const size = table.length;

    const MOVES = InitialMovesObject(size);

    const {
        UP, 
        LEFT, 
        RIGHT, 
        DOWN, 
        CORNER_UP_LEFT, 
        CORNER_UP_RIGHT, 
        CORNER_DOWN_RIGHT, 
        CORNER_DOWN_LEFT,
        GroupMovesByLimits
    } = MOVES;

    const COLOR = 'rgb(38, 184, 99)';

    let { x: _X, y: _Y } = randomPixel(table);

    function randomMove(x: number, y: number, table: table){

        const moves = GroupMovesByLimits.filter(e=> !e.isOverLimit(x, y)).map(e=>e.move);

        const validMoves = moves.map(e=>{

            const {x: X, y: Y} = e(x, y);

            return table[Y][X];
        
        }).filter(e=> !e.mark)

        return validMoves[Math.floor(validMoves.length*Math.random())];

    }

    let tempTimeOut: any = undefined;

    const start: eventPixel = (index, mark, changeMark, color)=>{
        
        color.current = COLOR;
        changeMark(true);
        
    };

    const click: eventPixel = (index, mark, changeMark, color)=>{
        
        if(!mark) return;

        clearInterval(tempTimeOut);
        changeMark(false);
        
    };

    const end: eventPixel = (index, mark, changeMark, color)=>{
        
        
        
    };

    const last: eventPixel = (index, mark, changeMark, color)=>{
        
        changeMark(false);
        
    };

    tempTimeOut = setInterval(()=>{

        eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start: last});

        const { x, y } = randomMove(_X, _Y, table);

        _X = x;
        _Y = y;

        eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start, click, end});
        
    }, 1500);

    eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start, click, end});

}

export {

    initSpeedPixel

}