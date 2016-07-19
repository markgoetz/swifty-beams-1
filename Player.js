Player.prototype = Object.create(Actor.prototype);
Player.parent = Actor.prototype;

function Player() {
	this.constructor(new Rectangle(0, Player.HEIGHT - Player.HITBOX_HEIGHT, Player.WIDTH, Player.HITBOX_HEIGHT), 'player');
}

Player.prototype.init = function() {
	Player.START_X = (game.WINDOW_WIDTH / 2) - (Player.WIDTH / 2);
	Player.START_Y = ((game.WINDOW_HEIGHT - SwiftyBeamsUIContainer.HEIGHT) / 2) - (Player.HEIGHT / 2);
	
	Player.parent.init.call(this, Player.START_X, Player.START_Y);
	
	this.direction = '';
	this.alive = true;
	this.falling = true;
	
	this.reset();
};

Player.WIDTH = 24;
Player.HEIGHT = 32;
Player.HITBOX_HEIGHT = 24;
Player.FALLING_HITBOX_HEIGHT = 32;
Player.MAX_VELOCITY = 220;

Player.ACCELERATION = 1500;
Player.AIR_ACCELERATION = 850;
Player.AIR_DECELERATION = 3000;
Player.DECELERATION = 2000;
Player.GRAVITY_ACCELERATION = 2500;

Player.prototype.reset = function() {
	this.x = Player.START_X;
	this.y = Player.START_Y;

	this.direction = 'right';
	this.alive = true;
	this.falling = true;
	
	this.stopHorizontal();
	this.stopVertical();
};

Player.prototype.moveLeft = function(delta) {
	var acceleration = (this.y_velocity > 0) ? Player.AIR_ACCELERATION : Player.ACCELERATION;
	
	this.x_velocity -= acceleration * delta;
	this.x_velocity = Math.max(this.x_velocity, -Player.MAX_VELOCITY);
};

Player.prototype.moveRight = function(delta) {
	var acceleration = (this.y_velocity > 0) ? Player.AIR_ACCELERATION : Player.ACCELERATION;
	
	this.x_velocity += acceleration * delta;
	this.x_velocity = Math.min(this.x_velocity, Player.MAX_VELOCITY);
};

// use prethink because the collision detection has to happen on the same frame that you try to fall.
// think is called after the y position is updated based on velocity.
Player.prototype.prethink = function(delta) {
	if (this.alive) {
		this.y_velocity += Player.GRAVITY_ACCELERATION * delta;
	}
};

Player.prototype.think = function(delta) {
	if (this.alive) {			
		
		// make sure the player isn't moving outside of the level bounds horizontally.
		if (this.x < 0) {
			this.x = .01;
			this.stopHorizontal();
		}
		if (this.x + this.hitbox.width > game.WINDOW_WIDTH) {
			this.x = game.WINDOW_WIDTH - this.hitbox.width - .01;
			this.stopHorizontal();
		}

		
		if (this.x_velocity < 0)
			this.setDirection('left');
		if (this.x_velocity > 0)
			this.setDirection('right');
	}
};

Player.prototype.setDirection = function(direction) {	
	this.direction = direction;
	this.queueAnimationName();
};

Player.prototype.queueAnimationName = function() {
	if (!this.alive) return;
	
	if (this.y_velocity != 0)
		this.animation_name = 'fall';
	else if (this.x_velocity != 0)
		this.animation_name = 'walk';
	else
		this.animation_name = 'stand';
		
	this.animation_name = this.animation_name + this.direction;
};

Player.prototype.updateAnimation = function() {
	if (this.sprite.current_animation.name != this.animation_name)
		this.sprite.playAnimation(this.animation_name);
};

Player.prototype.slowHorizontal = function(delta) {
	if (this.x_velocity < 0) {
		this.x_velocity += Player.DECELERATION * delta;
		if (this.x_velocity > 0) this.stopHorizontal();
	}
	else if (this.x_velocity > 0) {
		this.x_velocity -= Player.DECELERATION * delta;
		if (this.x_velocity < 0) this.stopHorizontal();
	}
	
	this.queueAnimationName();
};

Player.prototype.setFallingFlag = function() {
	this.falling = true;
};

Player.prototype.tryToFall = function() {
	if (this.falling) {
		this.y_velocity += Player.GRAVITY_ACCELERATION;
	};
};

Player.prototype.stopVertical = function() {
	Player.parent.stopVertical.call(this);
	this.queueAnimationName();
};

Player.prototype.stopHorizontal = function() {
	Player.parent.stopHorizontal.call(this);
	this.queueAnimationName();
};

Player.prototype.oncollide = function(other_actor, side) {
	if (other_actor instanceof LevelTile) {
		// Only process either a left-right collision, or a bottom collision.
		// Doing both will either lead to skipping over a gap, or getting stuck on the floor.
		if ((side.getSide(CollisionSides.sides.LEFT) || side.getSide(CollisionSides.sides.RIGHT)) && side.getSide(CollisionSides.sides.BOTTOM)) {
			
			if (this.getCollisionSubframeTime(other_actor, true) < this.getCollisionSubframeTime(other_actor, false))
				side.removeSide(CollisionSides.sides.BOTTOM);
			else {
				side.removeSide(CollisionSides.sides.LEFT);
				side.removeSide(CollisionSides.sides.RIGHT);
			}
		}
		
		this.collideStop(other_actor, side);
	}
	else if (other_actor instanceof Laser) {
		this.die();
	}
};

Player.prototype.die = function() {
	game.sound_map.getSound('died').play();
	
	for (var i = 0; i < 8; i++) {
		game.game_state.createDiedEffect(this.x, this.y, Math.PI * i / 4);	
	}
	
	this.alive = false;
	this.stopVertical();
	this.stopHorizontal();
	
	game.transition('gameover');
};
