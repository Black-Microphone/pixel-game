import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';
import { EventEmitter } from 'eventemitter3';
import { transitionOpt } from './globalTypes';
import { initSpeedPixel } from './pixelSpeed';
import { iniMutantPixel } from './mutantPixel';

const size = 10;

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

// GenerateTable.

function GenerateTable(){

  return new Array(size).fill(0).map((v, Y)=>new Array(size).fill(0).map((e, X)=>({x: X, y: Y, mark: false})));

}

//App

function App() {

  const pixelCount = useRef(0);
  const eventCenter = useRef(new EventEmitter());

  const tablesPositions = useRef(GenerateTable());

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

  function start(){

    iniMutantPixel(eventCenter, tablesPositions);

  }

  return (<div className="App"><div className='start' onClick={start}>Start</div><Table/></div>);

}

export default App;
