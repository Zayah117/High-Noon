var Cowboy = function(x, y, sprite, direction) {
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.minY = 40;
	this.maxY = 490;
	this.speed = 3;
	this.bullets = [];
	this.round = 0;
	this.sprite = sprite;
	this.movingUp = false;
	this.movingDown = false;
};

Cowboy.prototype.update = function(dt) {
	if (this.movingUp == true) {
		this.y -= this.speed;
		if (this.y <= this.minY) {
			this.y = this.minY;
		}
	}
	if (this.movingDown == true) {
		this.y += this.speed;
		if (this.y >= this.maxY) {
			this.y = this.maxY;
		}
	}

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
};

Cowboy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	for (i = 0; i < this.bullets.length; i++) {
		ctx.drawImage(Resources.get(this.bullets[i].sprite), this.bullets[i].x, this.bullets[i].y);
	}
};

Cowboy.prototype.keyUp = function(key) {
	upKeys = ['w', 'up'];
	downKeys = ['s', 'down'];
	shootKeys = ['f', 'enter'];
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
};

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

Cowboy.prototype.shoot = function() {
	if (this.direction == 'right') {
		this.bullets[this.round].x = 100;
		this.bullets[this.round].y = this.y + 22;
	} else {
		this.bullets[this.round].x = 500;
		this.bullets[this.round].y = this.y + 22;
	}

	if (this.round >= 5) {
		this.round = 0;
	} else {
		this.round += 1;
	}
};

var Bullet = function() {
	this.sprite = 'images/bullet.png';
	this.x = 0;
	this.y = -10;
};

goodGuy = new Cowboy(30, 250, 'images/good-guy.png', 'right');
badGuy = new Cowboy(500, 250, 'images/bad-guy.png', 'left');
for (var i = 0; i < 6; i++) {
	var goodBull = new Bullet();
	var badBull = new Bullet();
	goodGuy.bullets.push(goodBull);
	badGuy.bullets.push(badBull);
}

console.log(goodGuy.bullets);
console.log(badGuy.bullets);

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
		70: 'f'
	};
	var player2Keys = {
		38: 'up',
		40: 'down',
		13: 'enter'

	};
	if (player1Keys.hasOwnProperty(e.keyCode)) {
		goodGuy.keyUp(player1Keys[e.keyCode]);
	}
	if (player2Keys.hasOwnProperty(e.keyCode)) {
		badGuy.keyUp(player2Keys[e.keyCode]);
	}
});

