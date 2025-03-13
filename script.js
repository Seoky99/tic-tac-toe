console.log("test");

/*
    Gameboard is composed of Cells that hold a value
    that represents which Player marked them. 0=neutral, 1=P1, 2=P2
*/
function Cell(initVal) {
    let val = initVal; 

    function setVal(num) {
        val=num;
    }

    function getVal() {
        return val;
    }

    return {setVal, getVal};
}


function Player(val) {

    const playVal = val; 
    let playerWins = 0;
    
    function getPlayVal() {
        return playVal; 
    }

    function getPlayerWins() {
        return playerWins; 
    }

    function incrementPlayerWins() {
        playerWins++; 
    }

    return {getPlayVal, getPlayerWins, incrementPlayerWins};
}

/*
    Game Logic 
*/
function GameLogic(initialSize) {

    /*
    Gameboard
    */
    const Gameboard = (function(initSize) {
        const board = []; 
        const size = initSize; 

        function initBoard() {
            for (let i = 0; i < size; i++) {
                let row = [];
                for (let j = 0; j < size; j++) {
                    row[j] = Cell(-1);
                }
                board[i] = row; 
            }
        }

        function getBoard() {
            return board; 
        }

        function getBoardCell(i, j) {
            return board[i][j].getVal(); 
        }

        function modifyBoard(i, j, val) {
            board[i][j].setVal(val); 
        }
        initBoard(); 
        return {initBoard, getBoard, getBoardCell, modifyBoard};
    })(initialSize); 

    let player0; 
    let player1; 
    let whoseTurn = 0; 
    let turnTimer = 0; 
    const size = initialSize; 

    function startGame() {
        player0 = Player(0); 
        player1 = Player(1);

        /*let winnerFound = false; 

        while (!winnerFound) {
            doTurn(); 
        } */
    }

    function doTurn(i, j, player) {

        //receives playervalues  
        //selectCell() 
        turnTimer++;
        Gameboard.modifyBoard(i, j, player); 
        console.log(checkWin(turnTimer)); 
    }

    function printBoard() {
        str = "";
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                str = str + (Gameboard.getBoard()[i][j].getVal());
            }

            str = str + "\n";
        }
        console.log(str);
    }

    function setBoard(arr) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                Gameboard.modifyBoard(i, j, arr[i][j]);
            }
        }
    }

    /*
        Returns playerNumber of winning player.
        If it is a tie, returns -1.  
        If no player has won yet, returns -2.
    */
    function checkWin(turn) {

        let rows = [];
        let cols = []; 
        
        let diagonals = []; 
        let antidiagonals = []; 

        //initialize rows and cols: set all rows and cols to true initially 
        for (let i = 0; i < size; i++) {
            rows[i] = []; 
            cols[i] = [];
            for (let j = 0; j < 2; j++) {
                rows[i][j] = true;
                cols[i][j] = true; 
            }
        }

        //set the diagonals to true as well 
        for (let i = 0; i < 2; i++) {
            diagonals[i] = true; 
            antidiagonals[i] = true; 
        }

        //one pass check all cells and log info into arrs x-in-row not possible
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {

                const ownedVal = Gameboard.getBoardCell(i, j); 
                
                if(ownedVal != 0) {
                    rows[i][0] = false; 
                    cols[j][0] = false; 
                    if (i === j) diagonals[0] = false;
                    if (i + j === size - 1) antidiagonals[0] = false; 
                }

                if (ownedVal != 1) {
                    rows[i][1] = false; 
                    cols[j][1] = false; 
                    if (i === j) diagonals[1] = false;
                    if (i + j === size - 1) antidiagonals[1] = false; 
                }
            }
        }
       
        for (let row=0; row < rows.length; row++) {
            for (let player=0; player < rows[0].length; player++) {
                if (rows[row][player]) {
                    return player; 
                }
            }
        }

        for (let col=0; col < cols.length; col++) {
            for (let player=0; player < cols[0].length; player++) {
                if (cols[col][player]) {
                    return player; 
                }
            }
        }

        for (let i = 0; i < 2; i++) {
            if(diagonals[i]) {
                return i; 
            }

            if (antidiagonals[i]) {
                return i; 
            }
        }

        return (turn == size * size) ? -1 : -2;  
    }

    return {startGame, checkWin, printBoard, setBoard, doTurn};
}


let testarr = [
    [-1, 0, 0],
    [-1, 0, 1],
    [0, 1, -1]
]; 

test = GameLogic(3); 
