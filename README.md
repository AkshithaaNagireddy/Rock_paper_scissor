# 🎮 Rock Paper Scissors Game

An interactive, responsive Arcade-style **Rock Paper Scissors** web application built using modern HTML, CSS, and JavaScript. The application features match tracking ("First to 5 Points"), automated 3-second countdown timer animations, persistent stats, historical logs, dark/light mode, and custom victory modals with confetti animations.

## ✨ Features

- **Match Mode**: First player to reach 5 points wins the match.
- **3-Second Countdown Timer**: Animated timer initiates upon player move selection before revealing the computer's choice.
- **Scoreboard & Game Stats**: Tracks active player/computer scores, round count, total wins, losses, draws, and win rate percentage.
- **Recent Round Log**: Chronological list displaying move selections and round outcomes.
- **Theme Toggle**: Light Mode and Dark Mode support.
- **Keyboard Controls**: Quick move input using keyboard keys (`R` for Rock, `P` for Paper, `S` for Scissors).
- **Match Conclusion Overlay**: Victory and Game Over pop-up modals complete with an dynamic Canvas confetti particle animation.


## 📁 File Structure

```text
rock-paper-scissors/
├── index.html   # Main HTML structure
├── style.css    # Responsive styling & theme variables
└── script.js    # Game logic, timer, state management & confetti animation
