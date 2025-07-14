document.addEventListener('DOMContentLoaded', () => {
  // NEW: Prompt user for number of players and set active colors accordingly.
let numPlayers = parseInt(prompt("Enter number of players (2, 3, or 4):", "4"), 10);
  let availableColors;
  if(numPlayers === 2) {
    availableColors = ['Red', 'Green'];
  } else if(numPlayers === 3) {
    availableColors = ['Red', 'Blue', 'Green'];
  } else {
    availableColors = ['Red', 'Blue', 'Green', 'Yellow'];
  }
  let turnColors = [...availableColors];
  let activePlayers = [...availableColors];
  const rankings = [];
 const rollBtn = document.getElementById('roll-btn');
  const resultBtn = document.getElementById('result-btn');
  const cowrieContainer = document.getElementById('cowrie-container');
  let currentDiceResult = null;
  let isRolling = false;
  let isMoving = false;
  let waitingForSelection = false;
  let currentTurn = 0;

  const playerColors = {
    "Red": "#e74c3c",
    "Blue": "#3498db",
    "Green": "#4caf50",
    "Yellow": "#f1c40f"
  };

  const rollSound = new Audio('assets/audio/dice.mp3');
const moveSound = new Audio('assets/audio/step.mp3');
const winSound = new Audio('assets/audio/winner.mp3');
  const killSound = new Audio('assets/audio/dead.mp3');



 // At the top
const cowrieShells = document.getElementById('cowrie-shells');

rollBtn.addEventListener('click', () => {
  if (isRolling || isMoving || waitingForSelection) return; // prevent double roll
  isRolling = true;

  // Play roll sound only on valid user interaction
  if (rollSound) {
    rollSound.currentTime = 0;
    rollSound.play();
  }

  cowrieShells.innerHTML = ''; // Clear old cowries
  let upCount = 0;

  for (let i = 0; i < 4; i++) {
    const isUp = Math.random() > 0.5;
    if (isUp) upCount++;

    const img = document.createElement('img');
    img.src = isUp ? 'assets/img/cowrie-up.png' : 'assets/img/cowrie-down.png';
    img.alt = isUp ? 'Up' : 'Down';
    img.className = 'cowrie-img';
    img.style.width = '70px'; // Adjust size as needed
    img.style.height = '70px'; // Adjust size as needed
    img.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
    cowrieShells.appendChild(img);
  }

  const finalResult = (upCount === 0) ? 8 : upCount;

  setTimeout(() => {
    resultBtn.textContent = `Result: ${finalResult}`;
    resultBtn.disabled = false;
    currentDiceResult = finalResult;
    isRolling = false;
    waitingForSelection = true;
    rollBtn.textContent = `Select ${turnColors[currentTurn]}'s Piece`;
  }, 500);
});

  
  /*** Board & Pieces Code ***/
  const cellSize = 120;  // updated from 100
  const gap = 2;
  const pieceSize = 40;
  
  // Outer ring cells (anticlockwise order).
  const outerCells = [
    { row: 0, col: 0 },  // index 0 (top-left)
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 3, col: 0 },
    { row: 4, col: 0 },  // index 4 (bottom-left)
    { row: 4, col: 1 },
    { row: 4, col: 2 },
    { row: 4, col: 3 },
    { row: 4, col: 4 },  // index 8 (bottom-right)
    { row: 3, col: 4 },
    { row: 2, col: 4 },
    { row: 1, col: 4 },
    { row: 0, col: 4 },  // index 12 (top-right)
    { row: 0, col: 3 },
    { row: 0, col: 2 },
    { row: 0, col: 1 }
  ];
  // Added: Define home starting cells (no kills allowed).
  const homeCells = [
    outerCells[2],  // Red home cell.
    outerCells[6],  // Blue home cell.
    outerCells[10], // Green home cell.
    outerCells[14]  // Yellow home cell.
  ];
  
  // Inner ring cells (clockwise order).
  const innerCells = [
    { row: 1, col: 1 }, // index 0 (top-left inner)
    { row: 1, col: 2 }, // index 1
    { row: 1, col: 3 }, // index 2 (top-right inner)
    { row: 2, col: 3 }, // index 3
    { row: 3, col: 3 }, // index 4 (bottom-right inner)
    { row: 3, col: 2 }, // index 5
    { row: 3, col: 1 }, // index 6 (bottom-left inner)
    { row: 2, col: 1 }  // index 7
  ];
  
  // Center cell.
  const centerCell = { row: 2, col: 2 };
  

  // Safe Cells
  const safeCells = [
    { row: 1, col: 1 },
    { row: 1, col: 3 },
    { row: 3, col: 1 },
    { row: 3, col: 3 }
  ];

  // Draw crosses for safe cells
  safeCells.forEach(cell => {
    const cross = document.createElement('div');
    cross.className = 'safe-cross';
    cross.style.left = `${cell.col * (cellSize + gap) + cellSize / 2 - 10}px`;
    cross.style.top = `${cell.row * (cellSize + gap) + cellSize / 2 - 10}px`;
    document.getElementById('board').appendChild(cross);
  });

  /*  
    Each piece is defined with:
     - startIndex: Its starting position in outerCells.
     - innerStart: Its designated entry index in innerCells.
     Mapping:
       • Piece1 (Red, top-left, index 0)  -> innerStart: 0.
       • Piece2 (Blue, bottom-left, index 4) -> innerStart: 6.
       • Piece3 (Green, bottom-right, index 8) -> innerStart: 4.
       • Piece4 (Yellow, top-right, index 12) -> innerStart: 2.
  */
  const pieces = [
    // Red pieces with offsets
    { id: 'red1', color: 'Red', element: document.getElementById('red1'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 2, innerStart: 0, offset: {x: -10, y: -10} },
    { id: 'red2', color: 'Red', element: document.getElementById('red2'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 2, innerStart: 0, offset: {x: 10, y: -10} },
    { id: 'red3', color: 'Red', element: document.getElementById('red3'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 2, innerStart: 0, offset: {x: -10, y: 10} },
    { id: 'red4', color: 'Red', element: document.getElementById('red4'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 2, innerStart: 0, offset: {x: 10, y: 10} },
    // Blue pieces
    { id: 'blue1', color: 'Blue', element: document.getElementById('blue1'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 6, innerStart: 6, offset: {x: -10, y: -10} },
    { id: 'blue2', color: 'Blue', element: document.getElementById('blue2'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 6, innerStart: 6, offset: {x: 10, y: -10} },
    { id: 'blue3', color: 'Blue', element: document.getElementById('blue3'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 6, innerStart: 6, offset: {x: -10, y: 10} },
    { id: 'blue4', color: 'Blue', element: document.getElementById('blue4'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 6, innerStart: 6, offset: {x: 10, y: 10} },
    // Green pieces
    { id: 'green1', color: 'Green', element: document.getElementById('green1'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 10, innerStart: 4, offset: {x: -10, y: -10} },
    { id: 'green2', color: 'Green', element: document.getElementById('green2'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 10, innerStart: 4, offset: {x: 10, y: -10} },
    { id: 'green3', color: 'Green', element: document.getElementById('green3'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 10, innerStart: 4, offset: {x: -10, y: 10} },
    { id: 'green4', color: 'Green', element: document.getElementById('green4'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 10, innerStart: 4, offset: {x: 10, y: 10} },
    // Yellow pieces
    { id: 'yellow1', color: 'Yellow', element: document.getElementById('yellow1'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 14, innerStart: 2, offset: {x: -10, y: -10} },
    { id: 'yellow2', color: 'Yellow', element: document.getElementById('yellow2'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 14, innerStart: 2, offset: {x: 10, y: -10} },
    { id: 'yellow3', color: 'Yellow', element: document.getElementById('yellow3'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 14, innerStart: 2, offset: {x: -10, y: 10} },
    { id: 'yellow4', color: 'Yellow', element: document.getElementById('yellow4'), ring: 'outer', outerSteps: 0, innerSteps: 0, startIndex: 14, innerStart: 2, offset: {x: 10, y: 10} }
  ];
  
  // Update the function to store base position and current cell.
  function updatePiecePosition(piece, cell) {
    piece.currentCell = cell;
    let offsetX = 0, offsetY = 0;
    if(piece.ring === 'outer' && piece.outerSteps === 0 && piece.offset) {
      offsetX = piece.offset.x;
      offsetY = piece.offset.y;
    }
    const baseX = cell.col * (cellSize + gap) + (cellSize / 2) - (pieceSize / 2) + offsetX;
    const baseY = cell.row * (cellSize + gap) + (cellSize / 2) - (pieceSize / 2) + offsetY;
    piece.currentBaseX = baseX;
    piece.currentBaseY = baseY;
    piece.element.style.transform = `translate(${baseX}px, ${baseY}px)`;
    repositionSharedPieces();  // Update layout for pieces sharing this cell.
  }
  
  // New function: Groups pieces by cell and arranges them in a subgrid.
  function repositionSharedPieces() {
    const groups = {};
    pieces.forEach(piece => {
      if(piece.currentCell) {
        const key = `${piece.currentCell.row}-${piece.currentCell.col}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(piece);
      }
    });
    Object.keys(groups).forEach(key => {
      const group = groups[key];
      if(group.length > 1) {
        // Scale down effective piece size for spacing.
        const effectiveSize = pieceSize * 0.8;
        const count = group.length;
        const cols = Math.ceil(Math.sqrt(count));
        const totalWidth = cols * effectiveSize;
        const totalHeight = cols * effectiveSize;
        const offsetX0 = -totalWidth / 2 + effectiveSize / 2;
        const offsetY0 = -totalHeight / 2 + effectiveSize / 2;
        group.forEach((piece, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const addX = offsetX0 + col * effectiveSize;
          const addY = offsetY0 + row * effectiveSize;
          piece.element.style.transform = `translate(${piece.currentBaseX + addX}px, ${piece.currentBaseY + addY}px)`;
        });
      } else {
        group.forEach(piece => {
          piece.element.style.transform = `translate(${piece.currentBaseX}px, ${piece.currentBaseY}px)`;
        });
      }
    });
  }
 function killOpponents(cell, movingPiece) {
    if (safeCells.some(s => s.row === cell.row && s.col === cell.col)) return false;
    if (cell.row === centerCell.row && cell.col === centerCell.col) return false;
    if (homeCells.some(home => home.row === cell.row && home.col === cell.col)) return false;
    let killed = false;
    pieces.forEach(piece => {
      if (piece === movingPiece) return;
      if (piece.currentCell &&
          piece.currentCell.row === cell.row &&
          piece.currentCell.col === cell.col &&
          piece.color !== movingPiece.color) {
        if (piece.ring === 'outer' && piece.outerSteps === 0) return;
        resetPiece(piece);
        killed = true;
          // 🔊 Play kill sound
      killSound.currentTime = 0; // rewind to start
      killSound.play();
      }
    });
    return killed;
  }
  
  function resetPiece(piece) {
    piece.ring = 'outer';
    piece.outerSteps = 0;
    piece.innerSteps = 0;
    updatePiecePosition(piece, outerCells[piece.startIndex]);
  }
  
  // Initialize each piece at its starting outer cell.
  pieces.forEach(piece => {
    if(!availableColors.includes(piece.color)) {
      piece.element.style.display = 'none';
      return;
    }
    updatePiecePosition(piece, outerCells[piece.startIndex]);
    piece.element.addEventListener('click', () => {
      if (!waitingForSelection) return;
      if (piece.color !== turnColors[currentTurn]) return;
      waitingForSelection = false;
      isMoving = true;
      // Store the dice result for extra turn check.
      const diceRolled = currentDiceResult;
      movePieceBySteps(piece, currentDiceResult, (bonus) => {
        isMoving = false;
        currentDiceResult = null;
        // Grant extra turn if diceRolled is 4 OR if a kill occurred.
        if (!(diceRolled === 4 || bonus)) {
          currentTurn = (currentTurn + 1) % turnColors.length;
        }
        updateRollBtnText();
      });
    });
  });
  
  // Helper: Move one step for a piece; call callback after 500ms (CSS transition duration).
  function moveOneStep(piece, callback) {
    moveSound.play();
    if (piece.ring === 'outer') {
      // If the next step would complete the outer lap, move to inner ring.
      if (piece.outerSteps + 1 === outerCells.length) {
        piece.ring = 'inner';
        piece.innerSteps = 0;
        updatePiecePosition(piece, innerCells[piece.innerStart]);
      } else {
        piece.outerSteps++;
        const newIndex = (piece.startIndex + piece.outerSteps) % outerCells.length;
        updatePiecePosition(piece, outerCells[newIndex]);
      }
    } else if (piece.ring === 'inner') {
      piece.innerSteps++;
      const newIndex = (piece.innerStart + piece.innerSteps) % innerCells.length;
      if (piece.innerSteps === innerCells.length) {
        piece.ring = 'center';
        updatePiecePosition(piece, centerCell);
        checkForFinish(piece);
      } else {
        updatePiecePosition(piece, innerCells[newIndex]);
      }
    }
    setTimeout(callback, 500);
  }
  
  // New helper: Same as moveOneStep but without killing opponents.
  function moveOneStepNoKill(piece, callback) {
     moveSound.play();
    if (piece.ring === 'outer') {
      if (piece.outerSteps + 1 === outerCells.length) {
        piece.ring = 'inner';
        piece.innerSteps = 0;
        updatePiecePosition(piece, innerCells[piece.innerStart]);
      } else {
        piece.outerSteps++;
        const newIndex = (piece.startIndex + piece.outerSteps) % outerCells.length;
        updatePiecePosition(piece, outerCells[newIndex]);
      }
    } else if (piece.ring === 'inner') {
      piece.innerSteps++;
      const newIndex = (piece.innerStart + piece.innerSteps) % innerCells.length;
      if (piece.innerSteps === innerCells.length) {
        piece.ring = 'center';
        updatePiecePosition(piece, centerCell);
        checkForFinish(piece);
      } else {
        updatePiecePosition(piece, innerCells[newIndex]);
      }
    }
    // Do not call killOpponents at final landing.
    setTimeout(callback, 500);
  }
  
  // Recursively move a piece by a given number of steps, then call callback.
  function movePieceBySteps(piece, steps, callback) {
    if (steps <= 0) { 
      let bonus = killOpponents(piece.currentCell, piece);
      callback(bonus);
      return; 
    }
    if (steps === 1) {
      moveOneStepNoKill(piece, () => {
        movePieceBySteps(piece, steps - 1, callback);
      });
    } else {
      moveOneStep(piece, () => {
        movePieceBySteps(piece, steps - 1, callback);
      });
    }
  }
  
  // NEW: Check if a color has finished (all 4 pieces in center) and track rankings.
  function checkForFinish(piece) {
    if(piece.ring === 'center') {
      const colorPieces = pieces.filter(p => p.color === piece.color);
      const finishedCount = colorPieces.filter(p => p.ring === 'center').length;
      if(finishedCount === 4 && !rankings.includes(piece.color)) {
        rankings.push(piece.color);
        activePlayers = activePlayers.filter(c => c !== piece.color);
        alert(`${piece.color} finished with rank #${rankings.length}`);
        winSound.currentTime = 0;
    winSound.play();

        if(activePlayers.length === 1) {
          rankings.push(activePlayers[0]);
          alert(`Game Over!
Final Rankings:
1st: ${rankings[0]}
2nd: ${rankings[1]}
${rankings[2] ? "3rd: " + rankings[2] : ""}`);
        }
      }
    }
  }
  // After defining `turnColors` and `currentTurn`:
function updateRollBtnText() {
  rollBtn.textContent = `Roll Cowries - ${turnColors[currentTurn]}'s Turn`;
  rollBtn.style.background = playerColors[turnColors[currentTurn]];
  resultBtn.style.background = playerColors[turnColors[currentTurn]];
  resultBtn.textContent = 'Result';
  resultBtn.disabled = true;
}
  
  // Initialize roll button text (and color)
  updateRollBtnText();
});
