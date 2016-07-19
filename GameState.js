function GameState() {
	this.score = 0;
	this.best_score = 0;
	this.player = new Player();
	this.lasers = [];
	this.triggers = [];
	
	this.effects = [];
	this.effect_count = 0;	
	this.current_level = null;
	this.new_score = false;
};

GameState.prototype.init = function() {
	this.player.init();
		
	this.current_level = game.level_map.getLevel();
	this.current_level.init();
};

GameState.prototype.addScore = function() {
	this.score++;
	
	if (this.score > this.best_score) {
		this.best_score = this.score;
		this.new_score = true;
	}
};

GameState.prototype.reset = function() {
	this.player.reset();
	
	this.lasers = [];
	this.effects = [];
	this.effect_count = 0;
	
	this.score = 0;
	this.new_score = false;
	
	game.game_engine.setCamera(0, 0);
	
	this.current_level = game.level_map.getLevel();
	this.current_level.init();
};

GameState.prototype.addLaser = function(y) {
	// TO-DO: come up with a percentage of lasers from both sides.
	var initializer = Math.random();
	
	if (initializer < .04) {
		var laser1 = new Laser();
		var laser2 = new Laser();
		
		laser1.init(y, true);
		laser2.init(y, false);
		
		this.lasers.push(laser1);
		this.lasers.push(laser2);
	}
	else if (initializer > .52) {
		var laser = new Laser();
		laser.init(y, true);
		
		this.lasers.push(laser); 
	}
	else {
		var laser = new Laser();
		laser.init(y, false);
		this.lasers.push(laser);
	}
	
	game.sound_map.getSound('laser').play();
};

GameState.prototype.scrollDown = function() {
	this.current_level.addRow();
	
	// TO-DO: clean up.
};

GameState.prototype.createDiedEffect = function(x, y, angle) {
	var particle = new PlayerDiedEffect(x, y, angle);
	particle.id = this.effect_count++;
	this.effects.push(particle);
};

GameState.prototype.removeEffect = function(effect) {
	for (var i = 0, x = this.effects.length; i < x; i++) {
		if (this.effects[i].id == effect.id) {
			this.effects.splice(i, 1);
			return;
		}
	}
};
