Laser.prototype = Object.create(Actor.prototype);
Laser.parent = Actor.prototype;

Laser.HEIGHT = 32;
Laser.WIDTH = 320;
Laser.VELOCITY = 270;

function Laser() {
	this.constructor(new Rectangle(0, 0, Laser.WIDTH, Laser.HEIGHT), 'laser');
}

Laser.prototype.init = function(y, is_facing_left) {
	var x = (is_facing_left) ? game.WINDOW_WIDTH : -Laser.WIDTH;
	
	Laser.parent.init.call(this, x, y, 'static');

	if (is_facing_left)
		this.x_velocity = -Laser.VELOCITY;
	else
		this.x_velocity = Laser.VELOCITY;
};

Laser.prototype.oncollide = function(other_actor, side) {

};

Laser.prototype.think = function(delta) {
	if (this.x_velocity > 0 && this.x > 0) {
		this.x_velocity = 0;
		this.x = 0;
	}
	else if (this.x_velocity < 0 && this.x < 0) {
		this.x_velocity = 0;
		this.x = 0;
	}
};

Laser.prototype.remove = function() {
	//game.game_state.removePlayerBullet(this);
};
