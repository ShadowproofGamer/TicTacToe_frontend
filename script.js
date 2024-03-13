const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
let currentPlayer = X_CLASS;
let gameActive = true;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    gameActive = true;
    currentPlayer = X_CLASS;
    statusDisplay.innerText = `${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.innerHTML=""
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = currentPlayer === X_CLASS ? X_CLASS : O_CLASS;
    placeMark(cell, currentClass);

    // Disable further clicks until opponent's move is received
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });

    // Send move data to server
    const cellIndex = Array.from(cells).indexOf(cell);
    sendMoveToServer(cellIndex);

    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    }

}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.innerText = currentClass
}

function swapTurns() {
    currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
    statusDisplay.innerText = `${currentPlayer}'s turn`;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        statusDisplay.innerText = `It's a Draw!`;
    } else {
        statusDisplay.innerText = `${currentPlayer} Wins!`;
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

function sendMoveToServer(cellIndex) {
    // Example code to send move data to server
    // Replace this with your actual implementation
    const moveData = { cellIndex, currentPlayer };
    console.log('Sending move data to server:', moveData);

    // Simulating server response with a delay
    setTimeout(() => {
        // Example code to receive opponent's move from server
        // Replace this with your actual implementation
        const opponentMove = getOpponentMoveFromServer();
        console.log('Received opponent move from server:', opponentMove);
        updateBoard(opponentMove.cellIndex, opponentMove.currentPlayer);
    }, 1000); // Simulating server delay of 1 second
}

function getOpponentMoveFromServer() {
    // Example function to get opponent's move from server
    // Replace this with your actual implementation
    // This function should return an object with 'cellIndex' and 'currentPlayer'
    // representing the opponent's move
    return { cellIndex: getRandomEmptyCellIndex(), currentPlayer: O_CLASS }; // Example: Opponent's move is randomly chosen
}

function getRandomEmptyCellIndex() {
    // Example function to get a random empty cell index
    // Replace this with your actual implementation
    // This function should return the index of an empty cell on the board
    const emptyCells = [...cells].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return Array.from(cells).indexOf(emptyCells[randomIndex]);
}

function updateBoard(cellIndex, currentPlayer) {
    const cell = cells[cellIndex];
    const currentClass = currentPlayer === X_CLASS ? X_CLASS : O_CLASS;
    placeMark(cell, currentClass);
    if (!checkWin(currentClass) && !isDraw()) {
        // If the game is not over, enable player to make another move
        cells.forEach(cell => {
            cell.addEventListener('click', handleClick, { once: true });
        });
    }
}
