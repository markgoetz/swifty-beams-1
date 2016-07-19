SwiftyBeamsBestCounter.prototype = Object.create(TextUIElement.prototype);
SwiftyBeamsBestCounter.parent = TextUIElement.prototype;

function SwiftyBeamsBestCounter() {
	TextUIElement.call(this, '16px Silkscreen', '#ffffff');
};

SwiftyBeamsBestCounter.prototype.getValue = function() {
	return game.game_state.best_score;
};
