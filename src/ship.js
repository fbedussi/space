class Ship {
  constructor(ctx) {
    this.ctx = ctx
    this.image = new Image();
    this.image.src = 'ship.png';
    this.width =  Math.round(window.innerHeight * 0.035)
    this.height =  Math.round(window.innerHeight * 0.05)
    this.rocketsHeight = Math.round(this.height / 2)
    this.rockets = [new Image(), new Image()];
    this.rockets.forEach((rocket, i) => rocket.src = `rockets${i}.png`)
    this.explosions = [new Image(), new Image(), new Image(), new Image()]
    this.explosions.forEach((explosion, i) => explosion.src = `explosion${i}.png`)
    this.rocketToDraw = 0
    this.rocketsOn = false
    this.explosionIndex = null
    setInterval(() => {
      this.rocketToDraw = Math.round(Math.random())
    }, 50)
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this))
  }
  
  init() {
    this.play = true
    this.lives = 3
    this.posY = Math.round(window.innerHeight * 0.8)
    this.posX = Math.round(window.innerWidth * 0.5) - (this.width / 2)
  }

  handleOrientation(event) {
    if (this.play) {
      const newY = Math.round(this.posY + (event.beta * 0.2))
      const newX = Math.round(this.posX + (event.gamma * 0.2))
      if (newY < this.posY) {
        this.rocketsOn = true
        setTimeout(() => {
          if (newY >= this.posY) {
            this.rocketsOn = false
          }
        }, 400)
      }
      this.posY = Math.max(0, Math.min(window.innerHeight - this.height, newY))
      this.posX = Math.max(0, Math.min(window.innerWidth - this.width, newX))
      this.draw()
    }
  }

  draw() {
    this.ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height)
    if (this.rocketsOn) {
      this.ctx.drawImage(this.rockets[this.rocketToDraw], this.posX, this.posY + this.height, this.width, this.rocketsHeight)
    }
    if (this.explosions[this.explosionIndex]) {
      this.ctx.drawImage(this.explosions[this.explosionIndex], this.posX, this.posY, this.width, this.height)
      if (this.explosionIndex < this.explosions.length - 2) {
        setTimeout(() => {
          this.explosionIndex++
        }, 50)
      } else {
        this.explosionIndex = null
      }
    }
  }

  explode() {
    this.lives--
    this.explosionIndex = 0
  }

  stop() {
    this.play = false
  }

  addLife() {
    this.lives++
  }
}

export default Ship
