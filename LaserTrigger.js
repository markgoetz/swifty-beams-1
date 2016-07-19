LaserTrigger.prototype = Object.create(Actor.prototype);
LaserTrigger.parent = Actor.prototype;

LaserTrigger.HEIGHT = 1;
LaserTrigger.WIDTH = 320;
LaserTrigger.BEAM_DELAY = .07;

function LaserTrigger() {
	this.constructor(new Rectangle(0, 0, LaserTrigger.WIDTH, LaserTrigger.HEIGHT), 'trigger');
}

LaserTrigger.prototype.init = function(x, y) {	
	LaserTrigger.parent.init.call(this, x, y, 'static');
	this.triggered = false;
};

LaserTrigger.prototype.oncollide = function(other_actor, side) {
	if (other_actor instanceof Player && this.triggered == false) {
		this.triggered = true;
		game.game_state.scrollDown();
		this.setTimer(LaserTrigger.BEAM_DELAY, 'createLaser');
	}
};

LaserTrigger.prototype.createLaser = function() {
	game.game_state.addLaser(Math.floor(this.y / SwiftyBeamsLevel.TILE_SIZE) * SwiftyBeamsLevel.TILE_SIZE);
};
