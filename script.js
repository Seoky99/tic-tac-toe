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
const Game = (function(initialSize=3) {
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
    let winnerCallback = null; 
    const size = initialSize; 

    function startGame() {
        player0 = Player(0); 
        player1 = Player(1);
        Gameboard.initBoard();
    }

    function setWinnerCallback(callback) {
        winnerCallback = callback;
    }

    function doTurn(i, j, player) {
        turnTimer++;
        whoseTurn = whoseTurn == 0 ? 1 : 0; 
        Gameboard.modifyBoard(i, j, player); 
        let check = checkWin(turnTimer); 

        if (check === 0 && winnerCallback != null) {
            player0.incrementPlayerWins(); 
            winnerCallback(check);
        } else if (check == 1 && winnerCallback != null) {
            player1.incrementPlayerWins(); 
            winnerCallback(check); 
        } else if (check == -1 && winnerCallback != null) {
            winnerCallback(check);
        }
    }

    function getPlayer() {
        return whoseTurn; 
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

    function getGameboard() {
        return Gameboard;
    }

    function getSize() {
        return size; 
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
    return {startGame, checkWin, printBoard, setBoard, doTurn, getGameboard, getSize, getPlayer, setWinnerCallback};
})(); 

function ScreenController() {

    let boardDiv;
    let winner = false; 

    function init() {
        boardDiv = document.querySelector(".game-container");
        boardDiv.addEventListener("click", handleClick); 
        Game.setWinnerCallback(handleWin);
        Game.startGame(); 
        handleButtons();
    }

    function renderBoard() {
        boardDiv.textContent = "";
        const gameBoard = Game.getGameboard(); 
        const size = Game.getSize(); 

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let cell = document.createElement("button");
                cell.dataset.player = gameBoard.getBoardCell(i, j);
                cell.dataset.row = i; 
                cell.dataset.col = j; 
                cell.classList = `cell ${cellClassName(gameBoard.getBoardCell(i, j))}`;
                boardDiv.appendChild(cell);
            }
        } 

        boardDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    }

    function handleButtons() {
        const startButton = document.querySelector("#start");
        const buttonContainer = document.querySelector(".button-container");
        const restartButton = document.createElement("button");
        restartButton.id = "restart";
        restartButton.textContent = "Restart";

        startButton.addEventListener("click", e => {
            renderBoard();
            buttonContainer.removeChild(startButton);
            buttonContainer.appendChild(restartButton);
        });

        restartButton.addEventListener("click", resetGame);
    }

    function resetGame() {
        Game.startGame();
        renderBoard();
        document.querySelectorAll(".player h1").forEach(elt => {
            elt.classList.remove("winner");
            elt.classList.remove("draw");
        });
        winner = false;
    }

    function cellClassName(player) {
        switch (player) {
            case 0:
                return "X";
            case 1:
                return "O";
            default:
                return "none";
        }
    }

    function handleClick(e) {
        if (!winner) {
            const cell = e.target; 
            if (cell.matches("button")) {
                const turn = Game.getPlayer(); 
        
                if (Number(cell.dataset.player) === -1) {
                    Game.doTurn(Number(cell.dataset.row), Number(cell.dataset.col), turn);
                    renderBoard(); 
                }
            }
        }
    }

    function handleWin(player) {

        const p1 = document.querySelector(".player.left h1");
        const p2 = document.querySelector(".player.right h1");

        if (player==0) {
            p1.classList.add("winner");
        } else if (player==1) {
            p2.classList.add("winner");
        } else {
            p1.classList.add("draw");
            p2.classList.add("draw");
        }

        winner = true; 
    }

    return { init }; 
}

const screen = ScreenController(); 
screen.init(); 
