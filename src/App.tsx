import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
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

  const pixelsIndex = useRef(multiplePixel(3));
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

    const [mark, setMark] = useState(pixelsIndex.current.includes(i));

    function click(){

      if(pixelsIndex.current.includes(i)){

        pixelsIndex.current = pixelsIndex.current.filter(v=>v!==i);
        
        setMark(false);

      }

    }

    eventCenter.current.on('pixel', ({index})=>{

      if(index === i){

        setMark(true);

      } 

    });

    const defaultStyle = {
      transition: `all ${pixelTransition.duration}ms linear`,
    } as CSSProperties;

    const transitionStyles = {
      entering: {},
      entered: {
        backgroundColor: 'orange',
        transform: 'rotate(360deg)'
      },
    } as transitionOpt;

    function final(){

      eventCenter.current.emit('pixelPlus', {});

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

  return (
    <div className="App"><Table/></div>
  );
}

export default App;
