PlayerDiedEffect.prototype = Object.create(Effect.prototype);
PlayerDiedEffect.parent = Effect.prototype;

PlayerDiedEffect.TIME = 5;
PlayerDiedEffect.VELOCITY = 300;
PlayerDiedEffect.GRAVITY_ACCELERATION = 450;
PlayerDiedEffect.SIZE = 8;
PlayerDiedEffect.COLOR = '#4492C5';
PlayerDiedEffect.SHADOWS = 2;

function PlayerDiedEffect(x, y, angle) {
	this.constructor(x, y, PlayerDiedEffect.TIME);
	
	this.x_velocity = PlayerDiedEffect.VELOCITY * Math.cos(angle);
	this.y_velocity = PlayerDiedEffect.VELOCITY * Math.sin(angle);
	
	this.shadows = [];
}

PlayerDiedEffect.prototype.think = function(delta) {
	this.x += this.x_velocity * delta;
	this.y += this.y_velocity * delta;
	
	this.y_velocity += delta * PlayerDiedEffect.GRAVITY_ACCELERATION;
	this.shadows.shift([this.x, this.y]);
	this.shadows.splice(PlayerDiedEffect.SHADOWS, 1);
};

PlayerDiedEffect.prototype.display = function(context) {
	context.fillStyle = PlayerDiedEffect.COLOR;
	
	context.fillRect(this.x - game.game_engine.camera_x, this.y - game.game_engine.camera_y, PlayerDiedEffect.SIZE, PlayerDiedEffect.SIZE);
	
	for (var i = 0; i < PlayerDiedEffect.SHADOWS; i++) {
		if (!this.shadows[i]) break;
		var shadow = this.shadows[i];
		context.fillRect(shadow[0], shadow[1], PlayerDiedEffect.SIZE, PlayerDiedEffect.SIZE);
	}
};
