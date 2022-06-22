import { EventEmitter } from 'eventemitter3';
import { MutableRefObject } from 'react';
import { eventPixel, table } from './globalTypes';
import { randomPixel } from './globalFunc';

function iniHeavyPixel(
    eventCenter: MutableRefObject<InstanceType<typeof EventEmitter<string | symbol, any>>>,
    table: MutableRefObject<table>
    ){

    const COLOR = 'rgb(184, 38, 38)' /* red */;

    let { x: _X, y: _Y } = randomPixel(table);

    let life = 4;

    let tempTimeInterval: any = undefined;

    const start: eventPixel = (index, mark, changeMark, color)=>{
        
        color.current = COLOR;
        changeMark(true);
        
    };

    const click: eventPixel = (index, mark, changeMark, color)=>{
        
        life--;

        if(!life){

            if(!mark) return;

            changeMark(false);
            table.current[index.y][index.x].mark = false;    

            clearInterval(tempTimeInterval);

        }

        
    };

    const end: eventPixel = (index, mark, changeMark, color)=>{
        
        
        
    };
    
    tempTimeInterval = setInterval(()=>{

        life++;

    }, 1500);

    table.current[_Y][_X].mark = true;
    eventCenter.current.emit(`pixel-${_X}-${_Y}`, {start, click, end});

}

export {

    iniHeavyPixel

}