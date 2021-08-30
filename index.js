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

const canvas = document.querySelector('#canvas')
canvas.setAttribute('height', window.innerHeight)
canvas.setAttribute('width', window.innerWidth)
const ctx = canvas.getContext('2d')
ctx.font = "20px impact"

const numberOfAstroids = 30
const numberOfPowerUps = 5
const numberOfPoints = 10

let speed = 5
let play = false
let lives = 3
let score = 0
let cycles = 0
let level = 1

const asteroids = (new Array(numberOfAstroids).fill(undefined)).map(() => new Asteroid('asteroid.png', speed, ctx))
const powerUps = (new Array(numberOfPowerUps).fill(undefined)).map(() => new Asteroid('life.png', speed, ctx))
const points = (new Array(numberOfPoints).fill(undefined)).map(() => new Asteroid('point.png', speed, ctx))

const ship = new Ship(ctx)

const checkCollided = (items) => items.find(item => item.posX > ship.posX && item.posX < (ship.posX + ship.width) && item.posY > ship.posY && item.posY < (ship.posY + ship.height))

const drawText = () => {
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText(`Lives: ${lives} | Score: ${score} | Level ${level}`, 10, 50); 
}

let playing

const loop = async () => {
  cycles++
  if (cycles % 2000 === 0) {
    level++
    speed++
    const newAsteroids = (new Array(5).fill(undefined)).map(() => new Asteroid('asteroid.png', speed, ctx))
    asteroids = asteroids.concat(newAsteroids)
  } 
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  asteroids.forEach(asteroid => asteroid.move())
  powerUps.forEach(powerUp => powerUp.move())
  points.forEach(point => point.move())
  ship.draw()
  drawText()
  if (lives === 0) {
    stopTune()
    play = false
    startButton.hidden = false
    await playing
    playGameOversound()
  } else {
    window.requestAnimationFrame(loop)
  }
  const asteroidCollided = checkCollided(asteroids)
  if (asteroidCollided) {
    lives--
    playing = playLooseTune()
    asteroidCollided.init(speed)
  }
  const extraLiveCollided = checkCollided(powerUps)
  if (extraLiveCollided) {
    lives++
    playing = playWonTune()
    extraLiveCollided.init(speed)
  }
  const pointCollided = checkCollided(points)
  if (pointCollided) {
    score++
    playing = playWonTune()
    pointCollided.init(speed)
  }
}

const start = () => {
  lives = 3
  play = true
  score = 0
  playStartsound()
  ship.init()
  asteroids.forEach(asteroid => asteroid.init(speed))
  playTune()
  loop()
}

drawText()

const startButton = document.querySelector('button')
startButton.addEventListener('click', () => {
  startButton.hidden = true
  start()
})
