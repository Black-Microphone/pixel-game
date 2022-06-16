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
  CORNER_UP_Right, 
  CORNER_DOWN_Right, 
  CORNER_DOWN_Left 
} = MOVES;

function randomPixel(){

  return Math.floor(Math.random()*(size*size));

}

type eventPixel = (index: number, mark: boolean, changeMark: (v: boolean)=>void, color: MutableRefObject<string> )=>void;
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

  function Pixel({i}: {i: number}){

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

      if(funClick.current) funClick.current(i, currentMark.current, changeMark, color);

    }

    eventCenter.current.on('pixel', ({index, click, end, start})=>{

      if(index === i){

        funClick.current = click;
        funEnd.current = end;

        start(i, currentMark.current, changeMark, color);

      }

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

      if(funEnd.current) funEnd.current(i, currentMark.current, changeMark, color);

      //Reset

      funClick.current = undefined;
      funEnd.current = undefined;

    }

    return (
      <CSSTransition key={i} timeout={pixelTransition.duration} onExited={final} in={mark}>
        {(state)=><div className='pixel' onClick={click} style={{
          ...defaultStyle,
          ...transitionStyles[state],
        }}></div>}
      </CSSTransition>
    );
  }

  const Table = useMemo(()=>()=>{
    
    const pixels = new Array(size*size).fill(0).map((v, i)=><Pixel key={i} i={i}/>);

      return (<TransitionGroup  className='table' style={{

      gridTemplateColumns: `repeat(${size}, 1fr)`,
      gridTemplateRows: `repeat(${size}, 1fr)`,

    }}>{pixels}</TransitionGroup>);

  }, []);

  function initSpeedPixel(){

    const COLOR = 'rgb(38, 184, 99)';

    let pixelPosition = randomPixel();

    const arrayMoves = Object.values(MOVES);

    function randomMove(position: number){

      return arrayMoves[Math.floor(arrayMoves.length*Math.random())](position);

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

      eventCenter.current.emit('pixel', {index: pixelPosition, start: last});

      pixelPosition = randomMove(pixelPosition);
      eventCenter.current.emit('pixel', {index: pixelPosition, start, click, end});
      
    }, 1500);
    
    eventCenter.current.emit('pixel', {index: pixelPosition, start, click, end});

  }

  function start(){

    initSpeedPixel();

  }

  return (<div className="App"><div className='start' onClick={start}>Start</div><Table/></div>);

}

export default App;
