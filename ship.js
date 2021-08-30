class Ship {
  constructor(ctx) {
    this.ctx = ctx
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
    this.ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height)
  }
}

export default Ship
