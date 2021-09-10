import {
  stopTune,
  playStartsound,
  playGameOversound,
  playWonTune,
  playLooseTune,
  playTune,
} from './sound.js'
import Asteroid from './asteroid.js'
import Ship from './ship.js'
import NoSleep from './no-sleep.js';

const noSleep = new NoSleep()

const startButton = document.querySelector('button')
const legend = document.querySelector('ul')
const statusBar = document.querySelector('.statusBar')
const instructions = document.querySelector('.instructions')
const levelLabel = document.querySelector('h2')
const gameOverLabel = document.querySelector('h3')
const canvas = document.querySelector('canvas')
canvas.setAttribute('height', window.innerHeight)
canvas.setAttribute('width', window.innerWidth)
const ctx = canvas.getContext('2d')

const NUMBER_OF_ASTEROIDS = 30
const NUMBER_OF_NEW_ASTEROIDS = 5
const NUMBER_OF_POWER_UPS = 5
const NUMBER_OF_POINTS = 10

let speed
let score
let cycles
let level
let gameOver = true
let asteroids = []

const powerUps = (new Array(NUMBER_OF_POWER_UPS).fill(0)).map(() => new Asteroid('life.png', ctx))
const points = (new Array(NUMBER_OF_POINTS).fill(0)).map(() => new Asteroid('point.png', ctx))

const ship = new Ship(ctx)

const checkCollided = (items) => items.find(({posX, posY, radius}) => {
  const corners = [
    [posX, posY],
    [posX + radius, posY],
    [posX, posY + radius],
    [posX + radius, posY + radius],
  ]
  return corners.some(([x, y]) => x >= ship.posX && x <= (ship.posX + ship.width) && y >= ship.posY && y <= (ship.posY + ship.height))
})

const drawText = () => {
  statusBar.innerHTML = `<span>Lives:<span class="space"></span>${ship.lives}</span><span>Litter:<span class="space"></span>${score}</span><span>Level:<span class="space"></span>${level}</span>` 
}

const showLevelLabel = (level) => {
  levelLabel.innerHTML = `level<span class="space"></span>${level}`
  levelLabel.classList.remove('hidden')
  setTimeout(() => {
    levelLabel.classList.add('hidden')
  }, 800)
}

const loop = async () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ship.draw()
  drawText()
  
  window.requestAnimationFrame(loop)

  if (gameOver) {
    return
  }

  if (ship.lives === 0) {
    gameOverLabel.classList.remove('hidden')
    startButton.classList.remove('hidden')
    stopTune()
    ship.stop()
    navigator.vibrate(400);
    gameOver = true
    noSleep.disable()
    return
  } 

  cycles++
  if (cycles % 1500 === 0) {
    level++
    speed++
    showLevelLabel(level)
    asteroids = asteroids.concat((new Array(NUMBER_OF_NEW_ASTEROIDS).fill(0)).map(() => new Asteroid('asteroid.png', ctx)))
    asteroids.forEach(asteroid => asteroid.init(speed + Math.random()))
  }

  asteroids.forEach(asteroid => asteroid.move())
  powerUps.forEach(powerUp => powerUp.move())
  points.forEach(point => point.move())
  
  const asteroidCollided = checkCollided(asteroids)
  if (asteroidCollided) {
    ship.explode()
    navigator.vibrate(200);
    ship.lives > 0 ? playLooseTune() : playGameOversound()
    asteroidCollided.init(speed)
  }
  const extraLiveCollided = checkCollided(powerUps)
  if (extraLiveCollided) {
    ship.addLife()
    playWonTune()
    extraLiveCollided.init(speed)
  }
  const pointCollided = checkCollided(points)
  if (pointCollided) {
    score++
    playWonTune()
    pointCollided.init(speed)
  }
}

const start = () => {
  gameOverLabel.classList.add('hidden')
  startButton.classList.add('hidden')
  instructions.classList.add('hidden')

  statusBar.hidden = false
  legend.hidden = false
  
  score = 0
  speed = 4
  level = 1
  cycles = 0
  gameOver = false
  asteroids = (new Array(NUMBER_OF_ASTEROIDS).fill(0)).map(() => new Asteroid('asteroid.png', ctx))

  noSleep.enable()

  playStartsound()
  playTune()
  ship.init()
  showLevelLabel(level)
  asteroids.forEach(asteroid => asteroid.init(speed + Math.random()))
  powerUps.forEach(powerUp => powerUp.init((speed * 1.1) + Math.random()))
  points.forEach(point => point.init((speed * 1.2) + Math.random()))
}

loop()

startButton.addEventListener('click', start)
