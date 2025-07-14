# 🐚 DesiLudo – A Traditional Indian Board Game Reimagined

**Desi Ludo** is a web-based multiplayer board game inspired by traditional Indian gameplay using **cowrie shells** instead of dice. Each player races their four tokens to the center of the board by rolling shells and navigating both outer and inner tracks. The game incorporates strategic kills, safe zones, and lucky rolls — all wrapped in a vibrant, interactive interface.

---

## 🎯 Objective

Be the first to move all **four pieces** from your starting position to the **center cell** by rolling the cowrie shells. The player with all pieces in the center ranks higher. The game ends when three players complete the game, and the fourth is automatically placed last.

---

## 🧠 Game Rules

### 🎲 Cowrie Dice Roll

* **Cowrie shells** act as dice.
* Each roll results in **1-4 and 8** based on how many shells land face **up** (white) or **down** (dark).

  * 1 face up → Move 1 step
  * 2 face up → Move 2 steps
  * 3 face up → Move 3 steps
  * 4 face up → Move 4 steps
  * All face **down** (0 up) → Counted as **8** steps
  * Any invalid or zero → Player must re-roll

### 👣 Movement

* Each player starts with 4 pieces at a designated **starting point**.
* Players move their pieces around the **outer path**, then enter the **inner ring**, and finally reach the **center**.
* Movement is in a **fixed path**, and players must move the rolled number exactly.

### 🗡️ Killing

* If a player lands on a cell occupied by an opponent’s piece, the opponent’s piece is **killed** and sent back to its starting cell.
* **No killing allowed**:

  * On home (starting) cells
  * In **center** or **safe zones**

### 🛡️ Safe Cells

* These are marked with a **white cross (X)** and **cannot be attacked**.
* Locations:

  * **2nd and 4th cells** in **Row 2** and **Row 4**
  * Visually highlighted with a cross symbol.

### 🔁 Extra Turns

* Player gets an extra turn if:

  * Rolls a **4 or 8**
  * **Kills** an opponent

---

## 🎮 Features

* 🎲 Realistic **cowrie dice** shuffling with images
* 👤 Select **2 to 4 players**
* ✨ Beautiful animations and sound effects
* 🗂️ **Safe zones** and **strategic play**
* 💀 Kill logic with resets
* 🥇 **Automatic ranking system** for winners
* 🧠 AI/logic controlled turn system

---

## 📸 Screenshots

![Game Board](screenshot.png)

---

## 🔊 Sounds

* Piece Move: `move.mp3`
* Kill: `kill.mp3`
* Win Celebration: `win.mp3`

All sound effects are triggered at specific game events.

---

## 🚀 How to Play

1. Open `index.html` in a browser.
2. Enter the number of players (2 to 4).
3. Click the **Roll** button to throw cowries.
4. Select a piece to move.
5. Try to reach the center first with all 4 of your pieces.

---

## 🛠️ Technologies Used

* HTML, CSS, JavaScript
* DOM Animations
* Audio playback
* (Optional Multiplayer) – Firebase / Socket.io *(planned feature)*

---

## 🧩 Future Features

* 🌐 Online Multiplayer (Firebase or Socket.io)
* 📱 Mobile Responsive UI
* 🧠 AI opponent for single-player mode
* 🎨 Themes & board skins
* 📊 Leaderboard integration

---

## ✨ Credits

* Cowrie shell logic adapted from traditional Indian gameplay.
* Game design & implementation by **\[Your Name]**
* Inspired by Pachisi, Ludo, and classic desi board games.

---

## 📜 License

MIT License – Free to use and modify with credits.

---

Would you like this in `.md` format as a downloadable file? Or embedded into your project as `README.md`? I can also generate Markdown with formatting or GitHub-compatible badges if you're uploading it to GitHub.
