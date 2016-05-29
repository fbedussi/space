'use strict';

//Global variables
var field = document.querySelector('#field');
var initialEnemy = document.querySelector('.enemy');
var numberOfEnemies = 10;
var gameOver = false;
var bullets = [];
var enemies = [];

//Helpers
function moveEl(el, x, y) {
    el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';  
}

//Objects
var MovingObject = {
    move: function() {
        moveEl(this.el, this.x, this.y);
        this.y += this.velocity;
    },
    init: function(el, startX, startY, velocity) {
        this.el = el;
        field.appendChild(this.el);
        this.x = startX;
        this.y = startY;
        this.velocity = velocity;
        this.move();
        return this;
    }
};

var Bullet = {
    move: function() {
        moveEl(this.el, this.x, this.y);
        this.y -= this.velocity;
        return this.y > this.el.style.height;
    },
    init: function(startX, startY) {
        this.el = document.createElement('div');
        this.el.classList.add('bullet');
        field.appendChild(this.el);
        this.x = startX;
        this.y = startY;
        this.velocity = 2;
        this.move();
        return this;
    }
}

var ship = {
    move: function(e) {
        this.x = e.clientX;
        this.y = e.clientY;
        moveEl(this.el, this.x, this.y);  
    },
    fire: function() {
        console.log('fire');
        bullets.push(Object.create(Bullet).init(this.x, this.y));
    },
    init: function(el) {
        this.el = el;
        window.addEventListener('mousemove', this.move.bind(this));
        window.addEventListener('click', this.fire.bind(this));
    }
}

var Enemy = {
    move: function() {
        moveEl(this.el, this.x, this.y);
        this.y += this.velocity;
        if (this.y > window.innerHeight) {
            this.y = 0;
        };
    },
    isCollidedWith: function(object) {
        var thisPos = this.el.getBoundingClientRect();
        var objectPos = object.el.getBoundingClientRect();
        return Math.abs(thisPos.top - objectPos.top) < thisPos.height
                && Math.abs(thisPos.bottom - objectPos.bottom) < thisPos.height
                && Math.abs(thisPos.left - objectPos.left) < thisPos.width
                && Math.abs(thisPos.right - objectPos.right) < thisPos.width
    },
    destroy: function() {
      enemies.splice(enemies.indexOf(this), 1);
      field.removeChild(this.el);
    },
    init: function(el) {
        this.el = el;
        this.x = Math.random()*window.innerWidth;
        this.y = Math.random()*window.innerHeight;
        this.velocity = (Math.random()+1)*3;
        this.move();
        return this;
    }
}

function loop() {
    bullets.forEach(function(bullet, i){
        if (!bullet.move()) {
            bullets.splice(i, 1);
            field.removeChild(bullet.el);
            console.log('bullet deleted');
        };
    });
    
    enemies.forEach(function(enemy, i) {
        enemy.move();
        if (enemy.isCollidedWith(ship)) {
            console.log('game over');
            gameOver = true;
        }
        
        bullets.forEach(function(bullet) {
            if (enemy.isCollidedWith(bullet)) {
            enemy.destroy();
        }
        });
    
    });
    
    if (!gameOver) {
        requestAnimationFrame(loop);
    };
}


//Init
ship.init(document.querySelector('.ship'));

for (let i = 0; i < numberOfEnemies; i++) {
    let newEnemyEl = initialEnemy.cloneNode(true);
    newEnemyEl.classList.remove('hide');
    field.appendChild(newEnemyEl);
    enemies.push(Object.create(Enemy).init(newEnemyEl));
}

console.log(enemies);

//Start
loop();
