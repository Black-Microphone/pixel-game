import React, { useState } from "react";

function ModalInitialInformation(){

    const [show, setShow] = useState(true);

    return (<div className="modalInfo" hidden={!show}>

        <h2>Tutorial</h2>
        <p>
            GamePixels se trata de darle click a pixeles para borrarlos en el menor tiempo posible.
        </p>
        <h3>Tipos de pixeles</h3>
        <div className="pixel-info heavy">
            <h4><div className="pixel"></div>Heavy</h4>
            <p>Cada cierto tiempo se vuele más fuerte, por lo que si lo dejas tranquilo habrá que darle más clicks.</p>
        </div>
        <div className="pixel-info guardian">
            <h4><div className="pixel"></div>Guardian</h4>
            <p>Tiene una barrera alrededor de un pixel central que si no eliminas primero, no podrás borrar el núcleo.</p>
        </div>
        <div className="pixel-info speed">
            <h4><div className="pixel"></div>Speed</h4>
            <p>Se telenstranporta y cambia de posición rápidamente.</p>
        </div>
        <div className="pixel-info mutant">
            <h4><div className="pixel"></div>Mutant</h4>
            <p>Va generando copias alrededor de si mismo.</p>
        </div>
        <div className="pixel-info psycho">
            <h4><div className="pixel"></div>Psycho</h4>
            <p>Tiene varias copias falsas ya puestas, si eliminas la verdadera, todas las demás se eliminan.</p>
        </div>

        <div className="quit-modal" onClick={()=>setShow(v=>!v)}>Click aquí para ir al juego</div>

    </div>);

}

export {

    ModalInitialInformation

}