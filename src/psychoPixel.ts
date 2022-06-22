import { EventEmitter } from 'eventemitter3';
import { MutableRefObject } from 'react';
import { eventPixel, table } from './globalTypes';
import { randomPixel, randomArrE, isOverLimit } from './globalFunc';
import { InitialMovesObject } from './moves';

function iniPsychoPixel(
    eventCenter: MutableRefObject<InstanceType<typeof EventEmitter<string | symbol, any>>>,
    table: MutableRefObject<table>
    ){

    const COLOR = 'rgb(38, 174, 184)' /* cyan */;

    const { x: _X, y: _Y } = randomPixel(table);

    const LENGTH = table.current.length;

    const { GroupMovesByLimits, getSquare } = InitialMovesObject(LENGTH);

    function invokePsychoPixel(){

        const posiblesPixelsObject: {[x: string]: {x: number, y:number}} = {};

        const posiblesPixels = (new Array(3).fill(0).map((v, i)=>getSquare(_X, _Y, i)))
            .flat()
            .filter(({x, y})=>{

                const xLimit = isOverLimit(x);
                const yLimit = isOverLimit(y);

                return !(xLimit || yLimit);

            });
        
        posiblesPixels
            .forEach(({x, y})=>{

                /* Clear repeats */;

                posiblesPixelsObject[`${x}-${y}`] = {x, y};

            });

        let pixelsUnMark = Object.values(posiblesPixelsObject).filter(({x, y})=>{

            const isUnMark: boolean = !table.current[y][x].mark;
            const isDifferentOrigin = !((_X === x) && (_Y === y));

            return isUnMark && isDifferentOrigin;

        });

        const criticalPixel = randomArrE(pixelsUnMark);

        pixelsUnMark = pixelsUnMark.filter(({x, y})=>!((criticalPixel.x === x) && (y === criticalPixel.y)));

        const fakePixels: {x: number, y: number}[] = [];

        for(let i = 0; i < 6;i++){

            const index = Math.floor(pixelsUnMark.length*Math.random());

            fakePixels.push(pixelsUnMark[index]);
            delete pixelsUnMark[index];
            pixelsUnMark = pixelsUnMark.filter(v=>v);

        }

        return {fakePixels, criticalPixel}

    }

    function setPixel(x: number, y: number){

        table.current[y][x].mark = true;
        eventCenter.current.emit(`pixel-${x}-${y}`, {start, click, end});

    }

    const { criticalPixel, fakePixels } = invokePsychoPixel();

    const start: eventPixel = (index, mark, changeMark, color)=>{
        
        color.current = COLOR;
        changeMark(true);
        
    };

    const final: eventPixel = (index, mark, changeMark, color) => {

        changeMark(false);

    }

    const click: eventPixel = (index, mark, changeMark, color)=>{

        if(!mark) return;

        changeMark(false);
        table.current[index.y][index.x].mark = false;

        if((index.x === criticalPixel.x) && (index.y === criticalPixel.y)){

            [...fakePixels, {x: _X, y: _Y}].filter(v=>v).forEach(({x, y})=>{

                table.current[x][y].mark = true;
                eventCenter.current.emit(`pixel-${x}-${y}`, {start: final});

            });

            eventCenter.current.emit('pixel-complete');

        }

    };

    const end: eventPixel = (index, mark, changeMark, color)=>{
        
        
        
    };

    const arrayFinal = [...fakePixels, {x: _X, y: _Y}, criticalPixel].filter(v=>v);

    arrayFinal.forEach(({ x, y })=>{

        setPixel(x, y);

    });

}

export {

    iniPsychoPixel

}