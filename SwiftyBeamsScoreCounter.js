SwiftyBeamsScoreCounter.prototype = Object.create(TextUIElement.prototype);
SwiftyBeamsScoreCounter.parent = TextUIElement.prototype;

function SwiftyBeamsScoreCounter() {
	TextUIElement.call(this, '16px Silkscreen', '#ffffff');
};

SwiftyBeamsScoreCounter.prototype.getValue = function() {
	return game.game_state.score;
};
