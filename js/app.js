var Cowboy = function(x, y, sprite) {
	this.x = x;
	this.y = x;
	this.sprite = sprite;
};

Cowboy.prototype.update = function(dt) {
	// TODO
};

Cowboy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Cowboy.prototype.handleInput = function(key) {
	upKeys = ['w', 'up'];
	downKeys = ['s', 'down'];
	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	}
	if (isInArray(key, upKeys)) {
		this.y -= 3;
	}
	if (isInArray(key, downKeys)) {
		this.y += 3;
	}
}

goodGuy = new Cowboy(50, 50, 'images/good-guy.png');
badGuy = new Cowboy(100, 50, 'images/bad-guy.png');

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
		goodGuy.handleInput(player1Keys[e.keyCode]);
	}
	if (player2Keys.hasOwnProperty(e.keyCode)) {
		badGuy.handleInput(player2Keys[e.keyCode]);
	}
});

