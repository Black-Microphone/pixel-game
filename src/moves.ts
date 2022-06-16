
function InitialMovesObject(SIZE: number){

    const size = SIZE-1;

    const correctRange = (c: number)=>Math.min(Math.max(c, 0), size);

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

    const GroupMoves = {

        up: {
            isOverLimit: (x: number, y: number)=>y===0,
            move: UP,
        },
        left: {
            isOverLimit: (x: number, y: number)=>x===0,
            move: LEFT,
        },
        down: {
            isOverLimit: (x: number, y: number)=>y===size,
            move: DOWN,
        },
        right: {
            isOverLimit: (x: number, y: number)=>x===size,
            move: RIGHT,
        },
        corner_up_left: {
            isOverLimit: (x: number, y: number)=>(y===0) || (x===0),
            move: CORNER_UP_LEFT,
        },
        corner_up_right: {
            isOverLimit: (x: number, y: number)=>(y===0) || (x===size),
            move: CORNER_UP_RIGHT,
        },
        corner_down_left: {
            isOverLimit: (x: number, y: number)=>(y===size) || (x===0),
            move: CORNER_DOWN_LEFT,
        },
        corner_down_right: {
            isOverLimit: (x: number, y: number)=>(y===size) || (x===size),
            move: CORNER_DOWN_RIGHT,
        },

    };

    const GroupMovesByLimits = Object.values(GroupMoves);
    const GroupMovesCardinalsByLimits = [
        GroupMoves.up, 
        GroupMoves.down,
        GroupMoves.left,
        GroupMoves.right
    ];

    const moves = {

        UP,
        DOWN,
        LEFT,
        RIGHT,
        CORNER_UP_LEFT,
        CORNER_UP_RIGHT,
        CORNER_DOWN_RIGHT,
        CORNER_DOWN_LEFT,

    }
    const movesArray = Object.values(moves);

    const movesCardinals = {

        UP,
        DOWN,
        LEFT,
        RIGHT

    }
    const movesCardinalsArray = Object.values(moves);

    return {

        UP,
        DOWN,
        LEFT,
        RIGHT,
        CORNER_UP_LEFT,
        CORNER_UP_RIGHT,
        CORNER_DOWN_RIGHT,
        CORNER_DOWN_LEFT,
        moves,
        GroupMovesByLimits,
        movesArray,
        movesCardinals,
        movesCardinalsArray,
        GroupMovesCardinalsByLimits

    };

}

export {InitialMovesObject};