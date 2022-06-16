
function InitialMovesObject(size: number){

    const correctRange = (c: number)=>Math.min(Math.max(c, 0), size-1);

    function UP(X: number, Y: number, count?: number){

        const COUNT = count || 1;
      
        return {x: X, y: correctRange(Y-COUNT)};
      
    }
    function DOWN(X: number, Y: number, count?: number){

        const COUNT = count || 1;
      
        return {x: X, y: correctRange(Y+COUNT)};
      
    }
    function LEFT(X: number, Y: number, count?: number){

        const COUNT = count || 1;
      
        return {x: correctRange(X-COUNT), y: Y};
      
    }
    function RIGHT(X: number, Y: number, count?: number){

        const COUNT = count || 1;
      
        return {x: correctRange(X+COUNT), y: Y};
      
    }

    function CORNER_UP_LEFT(X: number, Y: number, count?: number){

        const COUNT = count || 1;
      
        return {x: correctRange(X-COUNT), y: correctRange(Y-COUNT)};
      
    }
    function CORNER_UP_RIGHT(X: number, Y: number, count?: number){

        const COUNT = count || 1;
      
        return {x: correctRange(X+COUNT), y: correctRange(Y-COUNT)};
      
    }
    function CORNER_DOWN_RIGHT(X: number, Y: number, count?: number){

        const COUNT = count || 1;
      
        return {x: correctRange(X+COUNT), y: correctRange(Y+COUNT)};
      
    }
    function CORNER_DOWN_LEFT(X: number, Y: number, count?: number){

        const COUNT = count || 1;
      
        return {x: correctRange(X+COUNT), y: correctRange(Y+COUNT)};
      
    }

    return {

        UP,
        DOWN,
        LEFT,
        RIGHT,
        CORNER_UP_LEFT,
        CORNER_UP_RIGHT,
        CORNER_DOWN_RIGHT,
        CORNER_DOWN_LEFT,

    };

}

export {InitialMovesObject};