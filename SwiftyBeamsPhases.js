function TitlePhase() {}
TitlePhase.prototype = Object.create(GamePhase.prototype);
TitlePhase.parent = GamePhase.prototype;

TitlePhase.prototype.updateLogic = function(game_state, delta) {

};

TitlePhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	if (key_handler.RUN)
		game.transition('run');
};

TitlePhase.prototype.renderGraphics = function(game_state, context) {
	game_state.current_level.renderBackground(context);
	
	this.logo.display(16, 16, 288, 288, context, false);
	
	context.fillStyle = '#55200a';
	context.font = '16px Silkscreen';
	context.textAlign = 'center';
	
	context.fillText('2014 by Mark Goetz', game.WINDOW_WIDTH / 2, 72);
	context.fillText("Instructions:", game.WINDOW_WIDTH / 2, 112);
	context.fillText('Use the arrow keys to move', game.WINDOW_WIDTH / 2, 144);
	context.fillText('Fall as far as you can', game.WINDOW_WIDTH / 2, 160);
	context.fillText("Oh, and don't get lasered", game.WINDOW_WIDTH / 2, 176);
	
	context.fillText('Press z to start', game.WINDOW_WIDTH / 2, 256);
};

TitlePhase.prototype.transitionTo = function() {
	this.logo = game.background_image_map.getBackgroundImage('logo');
};


function GameGraphicsPhase() {}
GameGraphicsPhase.prototype = Object.create(GamePhase.prototype);
GameGraphicsPhase.parent = GamePhase.prototype;

GameGraphicsPhase.prototype._displayGameGraphics = function(game_state, context) {
	game.game_engine.setCamera(0, game_state.player.y - (SwiftyBeamsLevel.TILE_SIZE * 3));
	
	game_state.current_level.renderBackground(context);
	game_state.current_level.renderGeometry(context);
	
	if (game_state.player.alive)
		game_state.player.display(context);

	for (var i = 0; i < game_state.lasers.length; i++)
		game_state.lasers[i].display(context);	
		
	/*for (var i = 0; i < game_state.current_level.triggers.length; i++)
		game_state.current_level.triggers[i].display(context);*/			
	
	for (var i = 0; i < game_state.effects.length; i++)
		game_state.effects[i].display(context);
	
	game.ui_container.display(context);
};



function GameRunPhase() {}
GameRunPhase.prototype = Object.create(GameGraphicsPhase.prototype);
GameRunPhase.parent = GameGraphicsPhase.prototype;

GameRunPhase.prototype.updateLogic = function(game_state, delta) {
	game_state.player.step(delta);

	game_state.current_level.geometryCheck(game_state.player);
	
	for (var i = 0; i < game_state.lasers.length; i++) {
		var laser = game_state.lasers[i];
		laser.step(delta);
		game_state.player.collisionTest(laser);
	}
	
	for (var i = 0; i < game_state.current_level.triggers.length; i++) {
		game_state.current_level.triggers[i].step(delta);
		game_state.current_level.triggers[i].collisionTest(game_state.player);
	};
	
	for (i = 0; i < game_state.effects.length; i++) {
		game_state.effects[i].step(delta);
	}
	
	game.ui_container.step(delta);
	
	game_state.player.updateAnimation();
};

GameRunPhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	var player = game_state.player;
	
	if (key_handler.LEFT_ARROW)
		player.moveLeft(delta);
	else if (key_handler.RIGHT_ARROW)
		player.moveRight(delta);
	else
		player.slowHorizontal(delta);	
	
	if (key_handler.RUN) {
		game.transition('pause');
	}
	
	if (key_handler.VOLUME_UP) {
		game.game_engine.volumeUp();
		game.showVolume();
	}
	else if (key_handler.VOLUME_DOWN) {
		game.game_engine.volumeDown();
		game.showVolume();
	}
};

GameRunPhase.prototype.renderGraphics = function(game_state, context) {
	this._displayGameGraphics(game_state, context);
};

function PausePhase() {}
PausePhase.prototype = Object.create(GameGraphicsPhase.prototype);
PausePhase.parent = GameGraphicsPhase.prototype;

PausePhase.prototype.updateLogic = function(game_state, delta) {
	game.ui_container.step(delta);
};

PausePhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	if (key_handler.RUN) {
		game.transition('run');
	}
};

PausePhase.prototype.renderGraphics = function(game_state, context) {
	this._displayGameGraphics(game_state, context);
	
	var width = game.WINDOW_WIDTH;
	var height = game.WINDOW_HEIGHT;
	context.fillStyle = 'rgba(255, 255, 255, .5)';
	context.fillRect(0, 0, width, height);
	
	context.textAlign = 'center';
	
	context.fillStyle = '#000000';
	context.font = '32pt Silkscreen';
	context.fillText('Paused', width / 2, height / 2 - 20);
	
	context.font = '16pt Silkscreen';
	context.fillText('Press z to continue', width / 2, height / 2 + 20);
};


function GameOverPhase() {}
GameOverPhase.prototype = Object.create(GameGraphicsPhase.prototype);
GameOverPhase.parent = GameGraphicsPhase.prototype;
GameOverPhase.NEW_SCORE_FLASH_TIME = .4;
GameOverPhase.NEW_SCORE_TEXT_RGB = '20,77,158';
GameOverPhase.FILL_RGB = '196,255,203';
GameOverPhase.TEXT_RGB = '85,33,10';
GameOverPhase.SCORE_STROKE_RGB = '85,33,10';
GameOverPhase.SCORE_FILL_RGB = '231,197,182';
GameOverPhase.FADEIN_TIME = .66;

GameOverPhase.prototype.updateLogic = function(game_state, delta) {
	for (var i = 0; i < game_state.lasers.length; i++) {
		var laser = game_state.lasers[i];
		laser.step(delta);
	}
	
	for (i = 0; i < game_state.effects.length; i++) {
		game_state.effects[i].step(delta);
	}
	
	if (this.alpha < 1) {
		this.alpha += (delta / GameOverPhase.FADEIN_TIME);
		if (this.alpha >= 1) this.alpha = 1;
	}
	
	if (game_state.new_score) {
		if (this.new_score_increasing) {
			this.new_score_alpha += (delta / GameOverPhase.NEW_SCORE_FLASH_TIME); 
			if (this.new_score_alpha >= 1) {
				this.new_score_alpha = 1;
				this.new_score_increasing = false;
			}
		}
		else {
			this.new_score_alpha -= (delta / GameOverPhase.NEW_SCORE_FLASH_TIME); 
			if (this.new_score_alpha <= .0000000001) {
				this.new_score_alpha = 0;
				this.new_score_increasing = true;
			}
		}
	}
};

GameOverPhase.prototype.interpretInput = function(game_state, delta, key_handler) {
	if (key_handler.RUN) {
		game.transition('run');
	}
};

GameOverPhase.prototype.renderGraphics = function(game_state, context) {
	
	this._displayGameGraphics(game_state, context);
	
	
	
	context.globalAlpha = this.alpha; 
	/*context.fillStyle = 'rgb(' + GameOverPhase.FILL_RGB + ')';
	context.fillRect(16, 16, game.WINDOW_WIDTH - 32, game.WINDOW_HEIGHT - 32);*/
	this.game_over_bg.display(16, 16, 288, 288, context, false);
	
	context.fillStyle = 'rgb(' + GameOverPhase.TEXT_RGB + ')';
	context.font = '16px Silkscreen';
	context.textAlign = 'center';
	
	context.fillText('Yup, you got lasered', game.WINDOW_WIDTH / 2, 80);
	context.fillText("Score:", game.WINDOW_WIDTH / 4 + 8, 112);
	context.fillText('Best:', game.WINDOW_WIDTH * 3 / 4 + 8, 112);	
	context.fillText('Press z to restart', game.WINDOW_WIDTH / 2, 256);
	
	if (game_state.new_score) {
		context.fillStyle = 'rgba(' + GameOverPhase.NEW_SCORE_TEXT_RGB + ',' + this.new_score_alpha + ')';
		context.fillText('New high score!', game.WINDOW_WIDTH / 2, 192);
	}
	
	context.font = '24px Silkscreen';
	context.fillStyle = 'rgb(' + GameOverPhase.SCORE_FILL_RGB + ')';
	context.strokeStyle = 'rgb(' + GameOverPhase.SCORE_STROKE_RGB + ')';
	context.lineWidth = 5;
	
	context.strokeText(game_state.score, game.WINDOW_WIDTH / 4 + 8, 128);
	context.fillText(game_state.score, game.WINDOW_WIDTH / 4 + 8, 128);

	context.strokeText(game_state.best_score, game.WINDOW_WIDTH * 3 / 4 + 8, 128);
	context.fillText(game_state.best_score, game.WINDOW_WIDTH * 3 / 4 + 8, 128);	

	context.globalAlpha = 1;
};

GameOverPhase.prototype.transitionTo = function() {
	if (this.game_over_bg == null) {
		this.game_over_bg = game.background_image_map.getBackgroundImage('gameover');
	}
	
	this.alpha = 0;
	
	if (game.game_state.new_score) {
		this.new_score_increasing = true;
		this.new_score_alpha = 0;
	}
};

GameOverPhase.prototype.transitionFrom = function() {
	game.game_engine.getGraphicsContext().globalAlpha = 1;
	game.game_state.reset();
};
