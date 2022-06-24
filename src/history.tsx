import { useRef } from "react"
import store from "store2";
import { IDH } from './globalTypes';
import { firstZero } from './globalFunc';
import moment from "moment";

function getDateString(date: Date){

    const DATE_M = moment(date);

    return `${firstZero(DATE_M.date())}/${firstZero(DATE_M.month()+1)}/${firstZero(DATE_M.year())}`;

}

function getTimeFormatted(time: number){

    const mili = firstZero(Math.trunc((time%1000)/100));
    const seconds = firstZero(Math.trunc((time/1000)%60));
    const minutes = firstZero(Math.trunc(((time/1000)/60)%60));

    return `${minutes}:${seconds}:${mili}`;

}

function History(){

    const history = useRef<IDH[]>(store.get('history'));

    const historyOrder = [...history.current].sort((a, b)=>{

        return b.time - a.time ;

    });

    const poor = historyOrder[0];
    const mid = history.current.reduce<IDH>((p, c)=>{

        console.log(p, c);

        return {time: p.time + c.time, date: p.date};

    }, {time: 0, date: new Date()}).time/(history.current.length) || 0;
    const top = historyOrder[historyOrder.length-1];

    return (<div className="history">
        <h2>Marcas</h2>
        {top && <div className="h-item best">
            🚴‍♂️<div>Mejor</div> <div>{getTimeFormatted(top.time)}</div> <div>{getDateString(top.date)}</div>
        </div>}
        {mid && <div className="h-item mid">
            📈<div>Promedio</div> <div>{getTimeFormatted(mid)}</div> 
        </div>}
        {poor && <div className="h-item poor">
            🐢<div>Más bajo</div> <div>{getTimeFormatted(poor.time)}</div> <div>{getDateString(poor.date)}</div>
        </div>}
        <h2>Historial</h2>
        {history.current.length && history.current.reverse().map(({date, time}, i)=>{

            return (<div className="h-item remains" key={i}>

                {`${getTimeFormatted(time)} — ${getDateString(date)}`}

            </div>);

        })}

    </div>);

}

export {

    History

}