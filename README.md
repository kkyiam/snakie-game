# Snakie - Futuristic Snake Game

A modern, futuristic snake game built with vanilla JavaScript that runs in web browsers and can be containerized.

## Features

- 🎮 Smooth snake movement with responsive controls
- 🎨 Futuristic neon UI with glowing effects
- 📊 Real-time scoring system
- 🏆 High score tracking (stored in browser)
- ⚡ Progressive difficulty (speed increases as you eat)
- 🎯 Gradient snake body with fade effect
- 💫 Animated food with glow effects
- ⏸️ Pause/Resume functionality
- 📱 Responsive design

## Controls

- **Arrow Keys** or **WASD**: Move the snake
- **Spacebar**: Pause/Resume game
- **START GAME**: Begin a new game
- **PAUSE**: Pause the current game

## Running Locally

Simply open `index.html` in any modern web browser.

## Running with Docker

1. Build the Docker image:
```bash
docker build -t snakie-game .
```

2. Run the container:
```bash
docker run -d -p 8080:80 snakie-game
```

3. Open your browser and navigate to:
```
http://localhost:8080
```

## Game Rules

- Control the snake to eat the glowing food
- Each food eaten increases your score by 10 points
- The snake grows longer with each food consumed
- Game speed increases progressively
- Avoid hitting walls or your own body
- Try to beat your high score!

## Technology Stack

- HTML5 Canvas
- CSS3 (Gradients, Animations, Shadows)
- Vanilla JavaScript (ES6+)
- Nginx (for containerized deployment)

## Browser Compatibility

Works on all modern browsers that support HTML5 Canvas:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera
