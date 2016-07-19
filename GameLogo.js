GameLogo.prototype = Object.create(Actor.prototype);
GameLogo.parent = Actor.prototype;

GameLogo.HEIGHT = 33;
GameLogo.WIDTH = 224;

function GameLogo() {
	this.constructor(new Rectangle(0, 0, GameLogo.WIDTH, GameLogo.HEIGHT), 'logo');
}