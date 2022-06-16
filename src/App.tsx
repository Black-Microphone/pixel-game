import React, { CSSProperties, useEffect, useMemo, useRef, useState, MutableRefObject } from 'react';
import { TransitionGroup, CSSTransition, TransitionStatus } from 'react-transition-group';
import './App.css';
import { EventEmitter } from 'eventemitter3';
import { InitialMovesObject } from './moves';

const size = 10;

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

const random = (n: number) => Math.floor(Math.random()*n);

function randomPixel(){

  return {x: random(size), y: random(size)};

}

type eventPixel = (index: {x: number, y: number}, mark: boolean, changeMark: (v: boolean)=>void, color: MutableRefObject<string> )=>void;
type transitionOpt = {[x in TransitionStatus]: CSSProperties};

const pixelTransition = {

  duration: 100

};

function multiplePixel(count: number){

  let array = new Array(size*size).fill(0).map((v, i)=>i);

  const result: number[] = [];

  for(let i = 0; i < count ; i++){

    const currentIndex = Math.floor(array.length*Math.random());
    
    console.log('index', currentIndex);

    result.push(array[currentIndex]);

    array = array.filter(v=>v!==currentIndex);

  }

  return result;

}

//Move



function App() {

  const pixelCount = useRef(0);
  const eventCenter = useRef(new EventEmitter());
  

  useEffect(()=>{

    eventCenter.current.on('pixelPlus', (data)=>{
      
      pixelCount.current++;

      console.log(pixelCount.current);

    });

  }, []);

  function Pixel({x, y}: {x: number, y: number}){

    const name = `pixel-${x}-${y}`;

    const [mark, setMark] = useState(false);
    const currentMark = useRef(mark);
    function changeMark(v: boolean){

      setMark(v);
      currentMark.current = v;

    }

    const color = useRef('');
    const funClick = useRef<any>(undefined);
    const funEnd = useRef<any>(undefined);

    function click(){

      if(funClick.current) funClick.current({x, y}, currentMark.current, changeMark, color);

    }

    eventCenter.current.on(name, ({click, end, start})=>{

      //Reset
      funClick.current = undefined;
      funEnd.current = undefined;

      // Init
      funClick.current = click;
      funEnd.current = end;

      start({x, y}, currentMark.current, changeMark, color);

    });

    const defaultStyle = {
      transition: `all ${pixelTransition.duration}ms linear`,
    } as CSSProperties;

    const transitionStyles = {
      entering: {},
      entered: {
        backgroundColor: color.current,
        transform: 'rotate(360deg)'
      },
    } as transitionOpt;

    function final(){

      if(funEnd.current) funEnd.current({x, y}, currentMark.current, changeMark, color);

      //Reset

      funClick.current = undefined;
      funEnd.current = undefined;

    }

    return (
      <CSSTransition key={name} timeout={pixelTransition.duration} onExited={final} in={mark}>
        {(state)=><div className='pixel' onClick={click} style={{
          ...defaultStyle,
          ...transitionStyles[state],
        }}></div>}
      </CSSTransition>
    );
  }

  const Table = useMemo(()=>()=>{

    const pixels: any[] = [];
    
    new Array(size).fill(0).map((v, y)=>{
      new Array(size).fill(0).map((v, x)=>{
        pixels.push(<Pixel key={`pixel-${x}-${y}`} x={x} y={y}/>)
      });
    });

      return (<TransitionGroup  className='table' style={{

      gridTemplateColumns: `repeat(${size}, 1fr)`,
      gridTemplateRows: `repeat(${size}, 1fr)`,

    }}>{pixels}</TransitionGroup>);

  }, []);

  function initSpeedPixel(){

    const COLOR = 'rgb(38, 184, 99)';

    let { x: X, y: Y } = randomPixel();

    function randomMove(x: number, y: number){

      const moves = GroupMovesByLimits.filter(e=> !e.isOverLimit(x, y)).map(e=>e.move);

      console.log(moves);

      return moves[Math.floor(moves.length*Math.random())](x, y);

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

      eventCenter.current.emit(`pixel-${X}-${Y}`, {start: last});

      const { x, y } = randomMove(X, Y);

      X = x;
      Y = y;

      eventCenter.current.emit(`pixel-${X}-${Y}`, {start, click, end});
      
    }, 1500);
    
    eventCenter.current.emit(`pixel-${X}-${Y}`, {start, click, end});

  }

  function start(){

    initSpeedPixel();

  }

  return (<div className="App"><div className='start' onClick={start}>Start</div><Table/></div>);

}

export default App;
