ScoreTrigger.prototype = Object.create(Actor.prototype);
ScoreTrigger.parent = Actor.prototype;

ScoreTrigger.HEIGHT = 4;
ScoreTrigger.WIDTH = 320;
ScoreTrigger.BEAM_DELAY = .2;

function ScoreTrigger() {
	this.constructor(new Rectangle(0, 0, ScoreTrigger.WIDTH, ScoreTrigger.HEIGHT), 'trigger');
}

ScoreTrigger.prototype.init = function(x, y) {	
	ScoreTrigger.parent.init.call(this, x, y, 'static');
	this.triggered = false;
};

ScoreTrigger.prototype.oncollide = function(other_actor, side) {
	if (other_actor instanceof Player && this.triggered == false) {
		this.triggered = true;
		game.sound_map.getSound('score').play();
		game.game_state.addScore();
	}
};