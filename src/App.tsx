import React, { CSSProperties, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { TransitionGroup, CSSTransition, TransitionStatus } from 'react-transition-group';
import './App.css';
import { EventEmitter } from 'eventemitter3';

const size = 10;

function randomPixel(size: number){

  return Math.floor(Math.random()*(size*size));

}

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

function UP(position: number, count?: number){

  const COUNT = count || 0;

  return Math.round(Math.min((position - size) + COUNT, 0));

}
function DOWN(position: number, count?: number){

  const COUNT = count || 0;

  return Math.round(Math.min((position + size) + COUNT, size*size));

}
function LEFT(position: number, count?: number){

  const COUNT = count || 1;

  return Math.round(Math.min(position - COUNT, 0));

}
function RIGHT(position: number, count?: number){

  const COUNT = count || 1;

  return Math.round(Math.min(position + COUNT, size*size));

}

function App() {

  const pixelCount = useRef(0);
  const eventCenter = useRef(new EventEmitter());
  

  useEffect(()=>{

    eventCenter.current.on('pixelPlus', (data)=>{
      
      pixelCount.current++;

      console.log(pixelCount.current);

      if(pixelCount.current === 3){

        pixelsIndex.current = multiplePixel(3);

        pixelsIndex.current.forEach((v)=>{
  
          eventCenter.current.emit('pixel', {index: v});
  
        });

        pixelCount.current = 0;

      }

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

      funClick.current(i, currentMark.current, changeMark, color);

    }

    eventCenter.current.on('pixel', ({index, click, end, start})=>{

      if(index === i){

        funClick.current = click;
        funEnd.current = end;

        start(i, currentMark.current, changeMark, color)

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

      funEnd.current(i, currentMark.current, changeMark, color);

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

  function start(){



  }

  return (<div className="App"><div className='start' onClick={start}>Start</div><Table/></div>);

}

export default App;
