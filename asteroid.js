class Asteroid  {
  constructor(imageName, speed, ctx) {
    this.imageName = imageName
    this.speed = speed
    this.ctx = ctx
    this.init()
  }
  
  init(speed) {
    this.speed = speed
    this.radius = Math.round(Math.random() * 10) + 10
    this.velX = (Math.round(Math.random() * this.speed * (Math.random() > 0.5 ? 1 : -1)) + 1)
    this.velY = (Math.round(Math.random() * this.speed) + 1)
    this.posX = Math.round(Math.random() * window.innerWidth)
    this.posY = -Math.round(Math.random() * window.innerHeight)
    this.image = new Image();
    this.image.src = this.imageName;
  }

  move() {
    this.posX += this.velX
    this.posY += this.velY
    if (this.posX < 0 || this.posX > window.innerWidth || this.posY > window.innerHeight) {
      this.init(this.speed)
    }
    this.draw()
  }

  draw() {
    this.ctx.drawImage(this.image, this.posX, this.posY, this.radius, this.radius);
  }
}

export default Asteroid
