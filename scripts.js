// Define the gameState object
let gameState = {
    players: [
        { name: 'player1', hand: [] },
        { name: 'player2', hand: [] }
    ],
    discardPile: [],
    drawPile: [],
    currentPlayerIndex: 0,
    gameStarted: false
};

// Sample deck initialization
function initializeDeck() {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2', 'wild', 'wildDraw4'];
    
    gameState.drawPile = [];
    
    colors.forEach(color => {
        values.forEach(value => {
            if (value === 'wild' || value === 'wildDraw4') {
                gameState.drawPile.push({ color: 'wild', value });
            } else {
                gameState.drawPile.push({ color, value });
                if (value !== '0') { // Add second set of non-zero cards
                    gameState.drawPile.push({ color, value });
                }
            }
        });
    });

    shuffleDeck(gameState.drawPile);
}

// Shuffle function
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to start the game
function startGame() {
    initializeDeck();
    gameState.gameStarted = true;
    // Deal 7 cards to each player
    gameState.players.forEach(player => {
        player.hand = [];
        for (let i = 0; i < 7; i++) {
            player.hand.push(gameState.drawPile.pop());
        }
    });

    // Set up the discard pile
    if (gameState.drawPile.length > 0) {
        gameState.discardPile.push(gameState.drawPile.pop());
    }

    document.querySelector('.main-menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    initializeGameBoard();
}

// Function to initialize the game board
function initializeGameBoard() {
    updateHandDisplay(gameState.players[0], 'player1');
    updateHandDisplay(gameState.players[1], 'player2');
    updateDiscardPile();
    updateTurnIndicator();
}

// Function to update hand display
function updateHandDisplay(player, playerId) {
    const handDiv = document.getElementById(`${playerId}Hand`);
    handDiv.innerHTML = ''; // Clear existing hand display
    player.hand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = `${card.color} ${card.value}`;
        cardElement.onclick = () => playCard(index, playerId);
        if (card.value === 'wild' || card.value === 'wildDraw4') {
            cardElement.classList.add('wild');
        }
        handDiv.appendChild(cardElement);
    });
}

// Function to update discard pile display
function updateDiscardPile() {
    const discardPileDiv = document.getElementById('discardPile');
    if (gameState.discardPile.length > 0) {
        const topCard = gameState.discardPile[gameState.discardPile.length - 1];
        discardPileDiv.innerHTML = `${topCard.color} ${topCard.value}`;
    } else {
        discardPileDiv.innerHTML = 'Discard Pile is empty';
    }
}

// Function to play a card
function playCard(cardIndex, playerId) {
    const currentPlayer = gameState.players.find(player => player.name === playerId);
    if (currentPlayer) {
        const cardToPlay = currentPlayer.hand[cardIndex];
        if (isValidPlay(cardToPlay)) {
            const handDiv = document.getElementById(`${playerId}Hand`);
            const cardElement = handDiv.children[cardIndex];
            cardElement.classList.add('played');
            setTimeout(() => {
                gameState.discardPile.push(currentPlayer.hand.splice(cardIndex, 1)[0]);
                updateGameBoard();
                checkForWin();
                endTurn();
            }, 300); // Match the animation duration
        } else {
            alert('Invalid card play.');
        }
    } else {
        console.error(`Player ${playerId} not found.`);
    }
}

// Function to validate card play
function isValidPlay(card) {
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    return card.color === topCard.color || card.value === topCard.value || card.color === 'wild';
}

// Function to check for win condition
function checkForWin() {
    gameState.players.forEach((player, index) => {
        if (player.hand.length === 0) {
            document.getElementById('winner').textContent = `Player ${index + 1} wins!`;
            document.getElementById('victory').classList.remove('hidden');
            document.getElementById('game').classList.add('hidden');
        }
    });
}

// Function to update the turn indicator
function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turnIndicator');
    if (turnIndicator) {
        turnIndicator.textContent = `${gameState.players[gameState.currentPlayerIndex].name}'s Turn`;
    } else {
        console.error('Turn indicator element not found.');
    }
}

// Function to end the turn
function endTurn() {
    if (!gameState.gameStarted) return;

    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updateTurnIndicator();
}

// Function to exit the game
function exitGame() {
    if (confirm("Are you sure you want to exit?")) {
        window.close(); // or navigate to another page if running in a browser
    }
}

// Add event listeners for game controls
document.getElementById('drawCard').addEventListener('click', drawCard);
document.getElementById('endTurn').addEventListener('click', endTurn);

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.main-menu').classList.remove('hidden');
});
