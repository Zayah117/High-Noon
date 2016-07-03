// Main cowboy class
var Cowboy = function(x, y, sprite, direction) {
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.minY = 40;
	this.maxY = 490;
	this.width = 70;
	this.height = 70;
	this.speed = 5;
	this.bullets = [];
	this.round = 0;
	this.clip = 6;
	this.isReloading = false;
	this.reloadTime = Date.now();
	this.recoil = Date.now();
	this.respawnTime = Date.now();
	this.dead = false;
	this.sprite = sprite;
	this.aliveSprite = sprite;
	this.movingUp = false;
	this.movingDown = false;
	this.score = 0;
};

// Checks whether or not the cowboy is
// moving, and moves the cowboys' bullets
// and handles cowboy reloading
Cowboy.prototype.update = function(dt) {
	// Move cowboy
	if (this.movingUp == true && this.dead == false) {
		this.y -= this.speed;
		if (this.y <= this.minY) {
			this.y = this.minY;
		}
	}
	if (this.movingDown == true && this.dead == false) {
		this.y += this.speed;
		if (this.y >= this.maxY) {
			this.y = this.maxY;
		}
	}

	// Move bullets for each cowboy
	if (this.direction == 'right') {
		for (var i = 0; i < this.bullets.length; i ++) {
			this.bullets[i].x += 5;
		}
	}

	if (this.direction == 'left') {
		for (var i = 0; i < this.bullets.length; i ++) {
			this.bullets[i].x -= 5;
		}
	}

	// Check for collisions
	this.checkCollision();

	// Work on respawning if dead
	if (this.dead == true) {
		this.respawn();
	}

	// Work on reload time if currently reloading
	if (this.isReloading) {
		if (Date.now() - this.reloadTime >= 200) {
			this.reloadTime = Date.now();
			this.clip += 1;

			// Wait till you have seven bullets then minus one
			// I want the clips to have 6 bullets but this is
			// for extra reload time
			if (this.clip >= 7) {
				this.clip -= 1;
				this.isReloading = false;
			}
		}
	}
};

// Renders cowboy and bullet sprites
Cowboy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	for (i = 0; i < this.bullets.length; i++) {
		ctx.drawImage(Resources.get(this.bullets[i].sprite), this.bullets[i].x, this.bullets[i].y);
	}
	if (this.isReloading == true) {
		ctx.drawImage(Resources.get('images/reload' + this.clip + '.png'), this.x + 5, this.y - 25)
	}
};

// Checks to see if the cowboy stops pressing
// move keys or presses shoot key
Cowboy.prototype.keyUp = function(key) {
	upKeys = ['w', 'up'];
	downKeys = ['s', 'down'];
	shootKeys = ['d', 'left'];
	reloadKeys = ['a', 'right'];
	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	}
	if (isInArray(key, upKeys)) {
		this.movingUp = false;
	}
	if (isInArray(key, downKeys)) {
		this.movingDown = false;
	}
	if (isInArray(key, shootKeys)) {
		this.shoot();
	}
	if (isInArray(key, reloadKeys)) {
		this.reload();
	}
};

// Checks to see if cowboy is holding down
// move keys
Cowboy.prototype.keyDown = function(key) {
	upKeys = ['w', 'up'];
	downKeys = ['s', 'down'];
	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	}
	if (isInArray(key, upKeys)) {
		this.movingUp = true;
	}
	if (isInArray(key, downKeys)) {
		this.movingDown = true;
	}
};

Cowboy.prototype.checkCollision = function () {
	enemy = this.enemy;
	for (i = 0; i < this.bullets.length; i++) {
		bull = this.bullets[i];
		
		if (enemy.dead == false && 
			bull.x < enemy.x + enemy.width && 
			bull.x + bull.width > enemy.x && 
			bull.y < enemy.y + enemy.height &&
			bull.height + bull.y > enemy.y) {
			enemy.dead = true;
			enemy.clip = 6;
			enemy.sprite = 'images/dead.png';
			enemy.respawnTime = Date.now();
			this.score += 1;
		}

		if (bull.x < cart1.x + cart1.width && 
			bull.x + bull.width > cart1.x && 
			bull.y < cart1.y + cart1.height &&
			bull.height + bull.y > cart1.y) {
			bull.y = -10;
		}

		if (bull.x < cart2.x + cart2.width && 
			bull.x + bull.width > cart2.x && 
			bull.y < cart2.y + cart2.height &&
			bull.height + bull.y > cart2.y) {
			bull.y = -10;
		}
	}
};

Cowboy.prototype.respawn = function() {
	if (this.dead == true && (Date.now() - this.respawnTime) > 3000) {
		this.y = Math.floor(Math.random() * 450) + 40;
		this.dead = false;
		this.sprite = this.aliveSprite;
	}
};
// Moves the least recently shot bullet
// to the cowboys gun
Cowboy.prototype.shoot = function() {  
	// If it's been more than 700 milliseconds
	// since cowboy last shot and he has bullets, 
	// he may shoot
	if ((Date.now() - this.recoil) > 100 && this.clip > 0 && this.isReloading == false &&
	 	this.dead == false && this.enemy.dead == false) {
		// If the cowboy is pointing right move
		// to that gun, otherwise move to the
		// other gun
		if (this.direction == 'right') {
			this.bullets[this.round].x = 100;
			this.bullets[this.round].y = this.y + 22;
		} else {
			this.bullets[this.round].x = 500;
			this.bullets[this.round].y = this.y + 22;
		}

		// Cycles through the cowboys' rounds
		if (this.round >= 5) {
			this.round = 0;
		} else {
			this.round += 1;
		}

		// A bullet is subtracted from clip
		this.clip -= 1;
		// Call this function after firing
		this.steadyGun();
	}
};

// Sets recoil variable to current time
Cowboy.prototype.steadyGun = function() {
	this.recoil = Date.now();
};

Cowboy.prototype.reload = function() {
	if (this.isReloading == false && this.clip < 6) {
		this.isReloading = true;
		this.reloadTime = Date.now();
	}
};

// Bullet class
var Bullet = function() {
	this.sprite = 'images/bullet.png';
	this.x = 0;
	this.y = -10;
	this.width = 4;
	this.height = 4;
};

var Cart = function(x, y, sprite, direction) {
	this.x = x;
	this.y = y;
	this.sprite = sprite;
	this.direction = direction;
	this.width = 100;
	this.height = 150;
};

Cart.prototype.update = function(dt) {
	if (this.direction == 'up') {
		if (this.y <= -150) {
			this.y = Math.floor(Math.random() * 1800) + 600;
		} else {
			this.y -= 2;
		}
	} else {
		if (this.y >= 600) {
			this.y = Math.floor(Math.random() * 1800) - 2400;
		} else {
			this.y += 2;
		}
	}
}

// Renders cowboy and bullet sprites
Cart.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Set cowboy objects and bullet arrays for each cowboy
goodGuy = new Cowboy(30, 250, 'images/good-guy.png', 'right');
badGuy = new Cowboy(500, 250, 'images/bad-guy.png', 'left');
goodGuy.enemy = badGuy;
badGuy.enemy = goodGuy;
for (var i = 0; i < 6; i++) {
	var goodBull = new Bullet();
	var badBull = new Bullet();
	goodGuy.bullets.push(goodBull);
	badGuy.bullets.push(badBull);
}

// Carts
cart1 = new Cart(200, Math.floor(Math.random() * 1800) - 2400, 'images/coveredwagon.png', 'down');
cart2 = new Cart(300, Math.floor(Math.random() * 1800) + 600, 'images/emptywagon.png', 'up');
cartArray = [cart1, cart2];

// Listen for key presses
document.addEventListener('keydown', function(e) {
	var player1Keys = {
		87: 'w',
		83: 's'
	};
	var player2Keys = {
		38: 'up',
		40: 'down'
	};
	if (player1Keys.hasOwnProperty(e.keyCode)) {
		goodGuy.keyDown(player1Keys[e.keyCode]);
	}
	if (player2Keys.hasOwnProperty(e.keyCode)) {
		badGuy.keyDown(player2Keys[e.keyCode]);
	}
});

document.addEventListener('keyup', function(e) {
	var player1Keys = {
		87: 'w',
		83: 's',
		68: 'd',
		65: 'a'
	};
	var player2Keys = {
		38: 'up',
		40: 'down',
		37: 'left',
		39: 'right'

	};
	if (player1Keys.hasOwnProperty(e.keyCode)) {
		goodGuy.keyUp(player1Keys[e.keyCode]);
	}
	if (player2Keys.hasOwnProperty(e.keyCode)) {
		badGuy.keyUp(player2Keys[e.keyCode]);
	}
});


