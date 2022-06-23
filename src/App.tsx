import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';
import { EventEmitter } from 'eventemitter3';
import { transitionOpt } from './globalTypes';
import { initSpeedPixel } from './pixels/pixelSpeed';
import { iniMutantPixel } from './pixels/mutantPixel';
import { iniHeavyPixel } from './pixels/heavyPixel';
import { iniPsychoPixel } from './pixels/psychoPixel';
import { iniGuardianPixel } from './pixels/guardianPixel';
import { ModalInitialInformation } from './modal';
import { eventPixel, IDH } from './globalTypes';
import { firstZero } from './globalFunc';
import store from 'store2';
import { History } from './history';

const size = 10;

const pixelTransition = {

  duration: 100

};

// GenerateTable.

function GenerateTable(){

  return new Array(size).fill(0).map((v, Y)=>new Array(size).fill(0).map((e, X)=>({x: X, y: Y, mark: false})));

}

//App
function App() {

  const pixelCount = useRef(0);
  const eventCenter = useRef(new EventEmitter());

  const tablesPositions = useRef(GenerateTable());

  const recordIntervalTime = useRef<any>();

  const pixelsCompletes = useRef(0);

  useEffect(()=>{

    eventCenter.current.on('pixelPlus', (data)=>{
      
      pixelCount.current++;

      console.log(pixelCount.current);

    });

    eventCenter.current.on('pixel-complete', ()=>{

      const count = ++pixelsCompletes.current;

      if(count === 5){

        end();

      }

    });

    const history: IDH[] = store.get('history');

    if(history && history.length){

      history.push({date: new Date(), time: 0});

    }else{

      store.set('history', []);

    }

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
      transition: `all ${pixelTransition.duration}ms ease-in-out`,
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

  function resetTable(){

    tablesPositions.current.flat().forEach(({x, y})=>{

      const start: eventPixel = (index, mark, changeMark)=>{

        changeMark(false);

      }

      eventCenter.current.emit(`pixel-${x}-${y}`, {start, end: undefined, click: undefined, destroy: true});
      tablesPositions.current[y][x].mark = false;

    });

  }

  const [viewTime, setViewTime] = useState('00:00:00');
  const time = useRef(0);
  const timeStart = useRef(false);
  const [indicatorTimeStart, setIndicatorTimeStart] = useState(false);

  function end(){

    const history: IDH[] = store.get('history');
    history.push({time: time.current, date: new Date()});
    store.set('history', history);

    pixelsCompletes.current = 0;
    clearInterval(recordIntervalTime.current);
    resetTable();
    timeStart.current = false;
    setIndicatorTimeStart(false);

  }

  function start(){

    if(!timeStart.current){

      setIndicatorTimeStart(true);

      recordIntervalTime.current = undefined;
      time.current = 0;

      recordIntervalTime.current = setInterval(()=>{
  
        time.current+= 100;
  
        const mili = firstZero(Math.trunc((time.current%1000))/100);
        const seconds = firstZero(Math.trunc((time.current/1000)%60));
        const minutes = firstZero(Math.trunc(((time.current/1000)/60)%60));
  
        setViewTime(`${minutes}:${seconds}:${mili}`);
  
      }, 100);
  
      iniPsychoPixel(eventCenter, tablesPositions);
      iniGuardianPixel(eventCenter, tablesPositions);
      iniMutantPixel(eventCenter, tablesPositions);
      initSpeedPixel(eventCenter, tablesPositions);
      iniHeavyPixel(eventCenter, tablesPositions);

      timeStart.current = true;

    }

  }

  const [viewHistory, setViewHistory] = useState(false);

  return (<div className="App">
    <div className={'button-history ' + (viewHistory?'select':'')} onClick={()=>setViewHistory(v=>!v)}>

      <div></div>
      <div></div>
      <div></div>

    </div>
    <ModalInitialInformation/>
    <div className='start' onClick={start}>{viewTime} 
      <div className='start-indicator'>{indicatorTimeStart?'🚴‍♂️':'🔴'}</div>
    </div>
    <Table/>
    {viewHistory && <History/>}
  </div>);

}

export default App;