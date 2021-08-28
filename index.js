import {
  playTone,
  play200sound,
  play404sound,
  playWonTune,
  playLooseTune,
  speak,
} from './sound.js';

const canvas = document.querySelector('#canvas')
canvas.setAttribute('height', window.innerHeight)
canvas.setAttribute('width', window.innerWidth)
const ctx = canvas.getContext('2d')
ctx.font = "20px Arial";

const numberOfAstroids = 30
const numberOfExtraLives = 5
const numberOfPoints = 5
const speed = 5

let play = true
let lives = 3
let score = 0

class Asteroid  {
  constructor(color) {
    this.color = color
    this.init()
  }
  
  init() {
    this.radius = Math.round(Math.random() * 10) + 10
    this.velX = (Math.round(Math.random() * speed * (Math.random() > 0.5 ? 1 : -1)) + 1)
    this.velY = (Math.round(Math.random() * speed) + 1)
    this.posX = Math.round(Math.random() * window.innerWidth)
    this.posY = -Math.round(Math.random() * window.innerHeight)
    this.create()
  }

  create() {
    const diameter = this.radius * 2
    this.imageData = ctx.createImageData(diameter, diameter);

    function setPixel(imageData, x, y, r, g, b, a){
      var index = (x + y * imageData.width);
      imageData.data[index * 4 + 0] = r;
      imageData.data[index * 4 + 1] = g;
      imageData.data[index * 4 + 2] = b;
      imageData.data[index * 4 + 3] = a;
    }

    const radiusSquare = Math.pow(this.radius, 2)
    for (let x=0;x < diameter; x++) {
      for(let y=0;y< diameter; y++) {
        const isInCircle = Math.pow(x - this.radius, 2) + Math.pow(y - this.radius, 2) < radiusSquare
        if (isInCircle) {
          setPixel(this.imageData, x, y, this.color[0] * Math.random(), this.color[1] * Math.random(), this.color[2] * Math.random(), 255 * Math.random())
        } else {
          setPixel(this.imageData, x, y, 0, 0, 0, 0)
        }
      }
    }
  }

  move() {
    this.posX += this.velX
    this.posY += this.velY
    if (this.posX < 0 || this.posX > window.innerWidth || this.posY > window.innerHeight) {
      this.init()
    }
    this.draw()
  }

  draw() {
    ctx.putImageData(this.imageData, this.posX, this.posY);
  }
}

const asteroids = (new Array(numberOfAstroids).fill(undefined)).map(() => new Asteroid([255,100,100]))
const extraLives = (new Array(numberOfExtraLives).fill(undefined)).map(() => new Asteroid([100,255,100]))
const points = (new Array(numberOfPoints).fill(undefined)).map(() => new Asteroid([100,100,255]))

class Ship {
  constructor() {
    this.image = new Image();
    this.image.src = 'ship.png';
    this.width =  Math.round(window.innerHeight * 0.07)
    this.height =  Math.round(window.innerHeight * 0.10)
    this.init()
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this))
  }
  
  init() {
    this.posY = Math.round(window.innerHeight * 0.8)
    this.posX = Math.round(window.innerWidth * 0.5) - (this.width / 2)
  }

  handleOrientation(event) {
    if (play) {
      const newY = Math.round(this.posY + (event.beta * 0.2))
      const newX = Math.round(this.posX + (event.gamma * 0.2))
      this.posY = Math.max(0, Math.min(window.innerHeight - this.height, newY))
      this.posX = Math.max(0, Math.min(window.innerWidth - this.width, newX))
      this.draw()
    }
  }

  draw() {
    ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height)
  }

}

const ship = new Ship()

const checkCollided = (items) => items.find(item => item.posX > ship.posX && item.posX < (ship.posX + ship.width) && item.posY > ship.posY && item.posY < (ship.posY + ship.height))

const loop = async () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  asteroids.forEach(asteroid => asteroid.move())
  extraLives.forEach(extraLive => extraLive.move())
  points.forEach(point => point.move())
  ship.draw()
  ctx.fillStyle = "white";
  ctx.fillText(`Lives: ${lives} - Score: ${score}`, 10, 50); 
  if (lives === 0) {
    play = false
    startButton.hidden = false
  } else {
    window.requestAnimationFrame(loop)
  }
  const asteroidCollided = checkCollided(asteroids)
  if (asteroidCollided) {
    lives--
    playLooseTune()
    asteroidCollided.init()
  }
  const extraLiveCollided = checkCollided(extraLives)
  if (extraLiveCollided) {
    lives++
    playWonTune()
    extraLiveCollided.init()
  }
  const pointCollided = checkCollided(points)
  if (pointCollided) {
    score++
    playWonTune()
    pointCollided.init()
  }
}

const start = () => {
  lives = 3
  play = true
  score = 0
  play200sound()
  ship.init()
  asteroids.forEach(asteroid => asteroid.init())
  loop()
}

const startButton = document.querySelector('button')
startButton.addEventListener('click', () => {
  startButton.hidden = true
  start()
})
