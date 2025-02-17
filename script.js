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

  /*** Global State for Dice and Turn Order ***/
  const rollBtn = document.getElementById('roll-btn');
  const resultBtn = document.getElementById('result-btn');
  const tetrahedron = document.getElementById('tetrahedron');
  let currentDiceResult = null; // holds dice result (1–4)
  let isRolling = false;
  let isMoving = false;
  let waitingForSelection = false;
  
  let currentTurn = 0; // 0: Red, 1: Blue, 2: Green, 3: Yellow
  
  // Mapping for front face color based on dice result.
  const surfaceColors = {
    1: '#00bcd4',  // Cyan
    2: '#e91e63',  // Magenta
    3: '#4caf50',  // Green
    4: '#e74c3c'   // Red
  };
  
  // New mapping for player colors
  const playerColors = {
    "Red": "#e74c3c",
    "Blue": "#3498db",
    "Green": "#4caf50",
    "Yellow": "#f1c40f"
  };
  
  // Function to generate dots on the front face based on the dice result.
  const generateDots = (dotCount) => {
    const targetFace = tetrahedron.querySelector('.face.face1');
    const existingDots = targetFace.querySelector('.dots');
    if (existingDots) existingDots.remove();
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'dots';
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dotsContainer.appendChild(dot);
    }
    targetFace.appendChild(dotsContainer);
  };
  
  // When tetrahedron rolling animation ends, generate a dice result.
  tetrahedron.addEventListener('animationend', () => {
    tetrahedron.classList.remove('rolling');
    tetrahedron.classList.add('show-only-front');
    currentDiceResult = Math.floor(Math.random() * 4) + 1; // 1 to 4
    generateDots(currentDiceResult);
    const face1 = tetrahedron.querySelector('.face.face1');
    // Set face color to the active player's color instead of dice number mapping.
    face1.style.background = playerColors[turnColors[currentTurn]];
    resultBtn.textContent = `Result: ${currentDiceResult}`;
    resultBtn.disabled = false;
    isRolling = false;
    waitingForSelection = true;
    rollBtn.textContent = `Select ${turnColors[currentTurn]}'s Piece`;
  });
  
  // Roll button: start dice roll if not already rolling or moving.
  rollBtn.addEventListener('click', () => {
    if (isRolling || isMoving) return;
    // Removed: if (waitingForSelection) return;
    isRolling = true;
    // Reset dice visuals.
    const targetFace = tetrahedron.querySelector('.face.face1');
    const existingDots = targetFace.querySelector('.dots');
    if (existingDots) existingDots.remove();
    // Set dice face color to current player's color.
    targetFace.style.background = playerColors[turnColors[currentTurn]];
    tetrahedron.classList.remove('show-only-front');
    tetrahedron.style.transform = 'rotateY(0deg) rotateX(0deg)';
    resultBtn.textContent = 'Result';
    resultBtn.disabled = true;
    // Force reflow so that the animation restarts.
    void tetrahedron.offsetWidth;
    tetrahedron.classList.add('rolling');
  });

  // Modified dice click listener: removed waitingForSelection check.
  tetrahedron.addEventListener('click', () => {
    if (isRolling || isMoving) return;
    rollBtn.click();
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
  
  // New functions: Kill opponent pieces and reset them to their initial positions.
  function killOpponents(cell, movingPiece) {
    if(cell.row === centerCell.row && cell.col === centerCell.col) return false;
    if (homeCells.some(home => home.row === cell.row && home.col === cell.col)) {
      return false;
    }
    let killed = false;
    pieces.forEach(piece => {
      if (piece === movingPiece) return;
      if (piece.currentCell &&
          piece.currentCell.row === cell.row &&
          piece.currentCell.col === cell.col &&
          piece.color !== movingPiece.color) {
        // Skip killing if the opponent is still at its home starting cell.
        if (piece.ring === 'outer' && piece.outerSteps === 0) return;
        resetPiece(piece);
        killed = true;
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
  
  // Update button text and colors to reflect the active player.
  function updateRollBtnText() {
    rollBtn.textContent = `Roll - ${turnColors[currentTurn]}'s Turn`;
    rollBtn.style.background = playerColors[turnColors[currentTurn]];
    resultBtn.style.background = playerColors[turnColors[currentTurn]];
  }
  
  // Initialize roll button text (and color)
  updateRollBtnText();
});
