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


const startButton = document.querySelector('button')
const legend = document.querySelector('legend')
const statusBar = document.querySelector('.statusBar')
const instructions = document.querySelector('p')
const levelLabel = document.querySelector('h1')
const canvas = document.querySelector('#canvas')
canvas.setAttribute('height', window.innerHeight)
canvas.setAttribute('width', window.innerWidth)
const ctx = canvas.getContext('2d')

const numberOfAstroids = 30
const numberOfPowerUps = 5
const numberOfPoints = 10

let speed = 5
let score = 0
let cycles = 0
let level = 1

let asteroids = (new Array(numberOfAstroids).fill(0)).map(() => new Asteroid('asteroid.png', speed, ctx))
const powerUps = (new Array(numberOfPowerUps).fill(0)).map(() => new Asteroid('life.png', speed, ctx))
const points = (new Array(numberOfPoints).fill(0)).map(() => new Asteroid('point.png', speed, ctx))

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
  statusBar.innerHTML = `<span>Lives: ${ship.lives}</span><span>Score: ${score}</span><span>Level: ${level}</span>` 
}

const showLevelLabel = (level) => {
  levelLabel.innerText = `level ${level}`
  levelLabel.classList.remove('hidden')
  setTimeout(() => {
    levelLabel.classList.add('hidden')
  }, 800)
}

let playing

const loop = async () => {
  cycles++
  if (cycles % 1500 === 0) {
    level++
    speed++
    showLevelLabel(level)
    const newAsteroids = (new Array(5).fill(0)).map(() => new Asteroid('asteroid.png', speed, ctx))
    asteroids = asteroids.concat(newAsteroids)
  } 
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  asteroids.forEach(asteroid => asteroid.move())
  powerUps.forEach(powerUp => powerUp.move())
  points.forEach(point => point.move())
  ship.draw()
  drawText()
  if (ship.lives === 0) {
    stopTune()
    ship.stop()
    startButton.hidden = false
    await playing
    playGameOversound()
  } else {
    window.requestAnimationFrame(loop)
  }
  const asteroidCollided = checkCollided(asteroids)
  if (asteroidCollided) {
    ship.explode()
    playing = playLooseTune()
    asteroidCollided.init(speed)
  }
  const extraLiveCollided = checkCollided(powerUps)
  if (extraLiveCollided) {
    ship.addLife()
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
  startButton.hidden = true
  statusBar.hidden = false
  legend.hidden = false
  instructions.hidden = true
  score = 0
  speed = 5
  level = 1
  playStartsound()
  ship.init()
  showLevelLabel(level)
  asteroids.forEach(asteroid => asteroid.init(speed))
  powerUps.forEach(powerUp => powerUp.init(speed))
  points.forEach(point => point.init(speed))
  playTune()
  loop()
}

startButton.addEventListener('click', start)
