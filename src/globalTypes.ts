import { CSSProperties, MutableRefObject } from "react";
import { TransitionStatus } from "react-transition-group";

type eventPixel = (index: {x: number, y: number}, mark: boolean, changeMark: (v: boolean)=>void, color: MutableRefObject<string> )=>void;
type transitionOpt = {[x in TransitionStatus]: CSSProperties};
type table = {x: number, y: number, mark: boolean}[][];

//ItemDataHistoryType
type IDH = {time: number, date: Date};

export type {

    eventPixel,
    transitionOpt,
    table,
    IDH

}