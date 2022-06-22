import { EventEmitter } from 'eventemitter3';
import { MutableRefObject } from 'react';
import { eventPixel, table } from './globalTypes';
import { InitialMovesObject } from './moves';
import { randomPixel } from './globalFunc';

function initSpeedPixel(
    eventCenter: MutableRefObject<InstanceType<typeof EventEmitter<string | symbol, any>>>, 
    table: MutableRefObject<table>
    ){

    const size = table.current.length;

    const MOVES = InitialMovesObject(size);

    const { GroupMovesByLimits } = MOVES;

    const COLOR = 'rgb(38, 184, 99)';

    let { x: _X, y: _Y } = randomPixel(table);

    function randomMove(x: number, y: number){

        const moves = GroupMovesByLimits.filter(e=> !e.isOverLimit(x, y)).map(e=>e.move);

        const validMoves = [...moves.map(e=>e(x, y)), ...moves.map(e=>e(x, y, 2))].map(e=>{

            const {x: X, y: Y} = e;

            return table.current[Y][X];
        
        }).filter(e=> !e.mark);

        if(!validMoves.length){

            return {x, y}

        }else return validMoves[Math.floor(validMoves.length*Math.random())];

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

        table.current[_Y][_X].mark = false;
        eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start: last, click: undefined});

        const { x, y } = randomMove(_X, _Y);

        _X = x;
        _Y = y;

        table.current[_Y][_X].mark = true;
        eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start, click, end});
        
    }, 1500);

    table.current[_Y][_X].mark = true;
    eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start, click, end});

}

export {

    initSpeedPixel

}