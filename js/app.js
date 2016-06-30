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

goodGuy = new Cowboy(50, 50, 'images/good-guy.png');
badGuy = new Cowboy(100, 50, 'images/bad-guy.png');