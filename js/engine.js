var Engine = (function(global) {
	var doc = global.document,
		win = global.window,
		canvas = doc.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		lastTime;

	canvas.width = 600;
	canvas.height = 600;
	doc.body.appendChild(canvas);

	function main() {
		var now = Date.now(),
			dt = (now - lastTime) / 1000.0;

		update(dt);
		render();

		lastTime = now;

		win.requestAnimationFrame(main);
	}

	function init() {
		lastTime = Date.now();
		main();
	}

	function update(dt) {
		updateEntities(dt);
		updateScore();
	}

	function updateEntities(dt) {
		goodGuy.update(dt);
		badGuy.update(dt);
	}

	function render() {
		var background = 'images/wildwest.png';
		ctx.drawImage(Resources.get(background), 0, 0);

		renderEntities();
	}

	function renderEntities() {
		goodGuy.render();
		badGuy.render();
	}

	function updateScore() {
		document.getElementById('g-score').innerHTML = 'Good Guy - ' + goodGuy.score;
		document.getElementById('b-score').innerHTML = 'Bad Guy - ' + badGuy.score;
	}

	Resources.load([
		'images/wildwest.png',
		'images/good-guy.png',
		'images/bad-guy.png',
		'images/bullet.png',
		'images/dead.png',
		'images/clock.png'
	]);

	Resources.onReady(init);

	global.ctx = ctx;

})(this);