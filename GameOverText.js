GameOverText.prototype = Object.create(Actor.prototype);
GameOverText.parent = Actor.prototype;

GameOverText.HEIGHT = 48;
GameOverText.WIDTH = 256;

function GameOverText() {
	this.constructor(new Rectangle(0, 0, GameOverText.WIDTH, GameOverText.HEIGHT), 'gameover');
}