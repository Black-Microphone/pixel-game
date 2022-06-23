import { useRef } from "react"
import store from "store2";
import { IDH } from './globalTypes';
import { firstZero } from './globalFunc';
import moment from "moment";

function getDateString(date: Date){

    const DATE_M = moment(date);

    return `${DATE_M.date()}/${DATE_M.month()+1}/${DATE_M.year()}`;

}

function getTimeFormatted(time: number){

    const mili = firstZero(Math.trunc((time%1000))/100);
    const seconds = firstZero(Math.trunc((time/1000)%60));
    const minutes = firstZero(Math.trunc(((time/1000)/60)%60));

    return `${minutes}:${seconds}:${mili}`;

}

function History(){

    const history = useRef<IDH[]>(store.get('history'));

    const historyOrder = [...history.current].sort((a, b)=>{

        return b.time - a.time ;

    });

    const top = historyOrder[0];
    const mid = history.current.reduce<IDH>((p, c)=>{

        return {time: p.time + c.time, date: p.date};

    }, {time: 0, date: new Date()}).time/(history.current.length-1);
    const poor = historyOrder[historyOrder.length-1];

    return (<div className="history">
        <h2>Marcas</h2>
        <div className="h-item best">Mejor — {`${getTimeFormatted(top.time)}\n${getDateString(top.date)}`}</div>
        <div className="h-item mid">Promedio — {`${getTimeFormatted(mid)}`}</div>
        <div className="h-item poor">Más bajo — {`${getTimeFormatted(poor.time)}\n${getDateString(poor.date)}`}</div>
        <h2>Historial</h2>
        {history.current.reverse().map(({date, time}, i)=>{

            return (<div className="h-item" key={i}>

                {`${getTimeFormatted(time)}\n${getDateString(date)}`}

            </div>);

        })}

    </div>);

}

export {

    History

}